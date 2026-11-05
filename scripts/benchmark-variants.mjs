// Run with `bun scripts/benchmark-variants.mjs [baseline SHA]`.
// Setup/transpilation is outside the timed Node process; temporary packages are exact baseline versions.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir, cpus, platform, arch } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { compileFunction } from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = ["button", "badge", "toggle", "tabs", "field", "input-group"];
const baseline = process.argv.includes("--measure")
  ? process.argv[4]
  : (process.argv[2] ?? "538d1961db8a82831667250ded51a4c225d5e286");
const committed = (file) =>
  execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" });

if (!process.argv.includes("--measure")) {
  const fixture = mkdtempSync(path.join(tmpdir(), "india-ai-variants-"));
  const setupStarted = performance.now();
  try {
    const lock = committed("bun.lock");
    const version = lock.match(
      /"class-variance-authority": \["class-variance-authority@([^"\s]+)"/,
    )?.[1];
    assert.ok(version, "baseline CVA version must come from its lockfile");
    const clsxVersion = lock.match(/"clsx": \["clsx@([^"\s]+)"/)?.[1];
    assert.ok(clsxVersion, "baseline clsx version must come from its lockfile");
    writeFileSync(
      path.join(fixture, "package.json"),
      JSON.stringify({
        private: true,
        dependencies: { "class-variance-authority": version, clsx: clsxVersion },
      }),
    );
    execFileSync("bun", ["install", "--cwd", fixture], { stdio: "pipe" });
    const require = createRequire(path.join(root, "package.json"));
    const babel = require("@babel/core");
    const stylex = await babel.transformAsync(committed("app/ui.stylex.js"), {
      filename: path.join(root, "app/ui.stylex.js"),
      configFile: false,
      babelrc: false,
      plugins: [
        [
          require.resolve("@stylexjs/babel-plugin"),
          {
            dev: false,
            runtimeInjection: false,
            treeshakeCompensation: true,
            enableMediaQueryOrder: false,
            unstable_moduleResolution: { type: "commonJS" },
          },
        ],
      ],
    });
    writeFileSync(
      path.join(fixture, "stylex.mjs"),
      stylex.code.replaceAll(
        '"@stylexjs/stylex"',
        JSON.stringify(pathToFileURL(require.resolve("@stylexjs/stylex")).href),
      ),
    );
    const transpiler = new Bun.Transpiler({ loader: "ts", target: "node" });
    writeFileSync(
      path.join(fixture, "candidate.mjs"),
      transpiler.transformSync(readFileSync(path.join(root, "lib/variants.ts"), "utf8")),
    );
    for (const file of files) {
      writeFileSync(
        path.join(fixture, `${file}.before.txt`),
        committed(`components/ui/${file}.tsx`),
      );
      writeFileSync(
        path.join(fixture, `${file}.after.txt`),
        readFileSync(path.join(root, `components/ui/${file}.tsx`), "utf8"),
      );
    }
    const utils = transpiler
      .transformSync(committed("lib/utils.ts"))
      .replaceAll('"@/app/ui.stylex"', '"./stylex.mjs"')
      .replaceAll(
        '"@stylexjs/stylex"',
        JSON.stringify(pathToFileURL(require.resolve("@stylexjs/stylex")).href),
      );
    writeFileSync(path.join(fixture, "utils.mjs"), utils);
    process.stdout.write(
      `Setup and transpilation: ${(performance.now() - setupStarted).toFixed(0)} ms, excluded from measurements\n`,
    );
    execFileSync("node", [fileURLToPath(import.meta.url), "--measure", fixture, baseline], {
      stdio: "inherit",
      env: process.env,
    });
  } finally {
    if (!process.env.BENCH_KEEP_FIXTURES) rmSync(fixture, { recursive: true, force: true });
  }
} else {
  const fixture = process.argv[3];
  assert.equal(
    process.version,
    "v" + committed(".node-version").trim(),
    "benchmark must use the pinned Node runtime",
  );
  // Use the application's ESM export so both selectors share the same clsx module.
  const { cva } = await import(
    pathToFileURL(path.join(fixture, "node_modules/class-variance-authority/dist/index.mjs")).href
  );
  const { defineVariants } = await import(pathToFileURL(path.join(fixture, "candidate.mjs")).href);
  const { classNames } = await import(pathToFileURL(path.join(fixture, "stylex.mjs")).href);
  const { cn } = await import(pathToFileURL(path.join(fixture, "utils.mjs")).href);
  const controls = [];
  const parse = (source, factory) =>
    [...source.matchAll(/const (\w+Variants) = (?:cva|defineVariants)\(([\s\S]*?)\n\}\);/g)].map(
      (match) => ({
        name: match[1],
        ...compileFunction(`return select(${match[2]}\n});`, ["classNames", "select"])(
          classNames,
          factory,
        ),
      }),
    );
  let comparisons = 0;
  for (const file of files) {
    const before = parse(
      readFileSync(path.join(fixture, `${file}.before.txt`), "utf8"),
      (base, config) => ({ base, config, select: cva(base, config) }),
    );
    const after = parse(
      readFileSync(path.join(fixture, `${file}.after.txt`), "utf8"),
      (base, config) => ({ base, config, select: defineVariants(base, config) }),
    );
    assert.equal(before.length, after.length);
    for (let i = 0; i < before.length; i++) {
      assert.deepEqual(after[i].config, before[i].config);
      assert.equal(after[i].base, before[i].base);
      let inputs = [{}];
      for (const [name, choices] of Object.entries(before[i].config.variants)) {
        inputs = inputs.flatMap((props) =>
          [undefined, null, ...Object.keys(choices)].map((value) => ({ ...props, [name]: value })),
        );
      }
      inputs.push(
        undefined,
        { class: "caller-class" },
        { className: "caller-name" },
        { class: ["nested", false, ["deeper"]], className: { enabled: true, disabled: false } },
      );
      for (const props of inputs) {
        const old = before[i].select(props);
        const next = after[i].select(props);
        assert.equal(next, old, `${file}/${before[i].name}: ${JSON.stringify(props)}`);
        assert.equal(
          cn(next, classNames.button171, classNames.button173),
          cn(old, classNames.button171, classNames.button173),
        );
        comparisons++;
      }
      controls.push({ ...after[i], old: before[i].select, inputs });
    }
  }
  const booleanConfig = {
    variants: { active: { true: "yes", false: "no" } },
    defaultVariants: { active: true },
  };
  for (const active of [undefined, null, true, false])
    assert.equal(
      defineVariants("base", booleanConfig)({ active }),
      cva("base", booleanConfig)({ active }),
    );
  const button = controls.find((control) => control.name === "buttonVariants");
  const scenarios = [
    { name: "button defaults", old: button.old, next: button.select, inputs: [undefined, {}] },
    {
      name: "button typical",
      old: button.old,
      next: button.select,
      inputs: [
        { variant: "outline", size: "sm", className: "caller" },
        { variant: "ghost", size: "icon", className: undefined },
      ],
    },
    {
      name: "button nested caller classes",
      old: button.old,
      next: button.select,
      inputs: [
        {
          variant: null,
          size: null,
          class: ["nested", false, ["deep"]],
          className: { enabled: true, disabled: false },
        },
      ],
    },
    {
      name: "button large caller classes",
      old: button.old,
      next: button.select,
      inputs: [
        {
          className: Array.from({ length: 200 }, (_, i) => [
            `class-${i}`,
            { [`enabled-${i}`]: i % 2 },
          ]),
        },
      ],
    },
    ...controls.map((control) => ({
      name: `${control.name} all variants`,
      old: control.old,
      next: control.select,
      inputs: control.inputs,
    })),
    {
      name: "button plus StyleX conflicts",
      old: (props) => cn(button.old(props), classNames.button171, classNames.button173),
      next: (props) => cn(button.select(props), classNames.button171, classNames.button173),
      inputs: button.inputs,
    },
  ];
  const samples = Number(process.env.BENCH_SAMPLES ?? 21);
  const iterations = Number(process.env.BENCH_ITERATIONS ?? 30000);
  const warmup = Number(process.env.BENCH_WARMUP ?? 50000);
  let sink = 0;
  const time = (fn, inputs, count) => {
    const started = performance.now();
    for (let i = 0; i < count; i++) sink += fn(inputs[i % inputs.length]).length;
    return ((performance.now() - started) * 1e6) / count;
  };
  const percentile = (values, fraction) =>
    values.toSorted((a, b) => a - b)[Math.ceil(values.length * fraction) - 1];
  process.stdout.write(
    JSON.stringify({
      baseline,
      node: process.version,
      platform: platform(),
      arch: arch(),
      cpu: cpus()[0]?.model,
      samples,
      iterations,
      warmup,
      oracleComparisons: comparisons,
      note: "Steady-state nanoseconds per call; alternating order. Setup, transpilation and process startup excluded.",
    }) + "\n",
  );
  process.stdout.write(
    "| Scenario | Baseline median ns | Candidate median ns | Ratio | Baseline p95 ns | Candidate p95 ns |\n| --- | ---: | ---: | ---: | ---: | ---: |\n",
  );
  for (const scenario of scenarios) {
    for (const props of scenario.inputs) assert.equal(scenario.next(props), scenario.old(props));
    time(scenario.old, scenario.inputs, warmup);
    time(scenario.next, scenario.inputs, warmup);
    const old = [],
      next = [];
    for (let sample = 0; sample < samples; sample++) {
      if (sample % 2 === 0) {
        old.push(time(scenario.old, scenario.inputs, iterations));
        next.push(time(scenario.next, scenario.inputs, iterations));
      } else {
        next.push(time(scenario.next, scenario.inputs, iterations));
        old.push(time(scenario.old, scenario.inputs, iterations));
      }
    }
    const oldMedian = percentile(old, 0.5),
      nextMedian = percentile(next, 0.5);
    process.stdout.write(
      `| ${scenario.name} | ${oldMedian.toFixed(0)} | ${nextMedian.toFixed(0)} | ${(nextMedian / oldMedian).toFixed(3)} | ${percentile(old, 0.95).toFixed(0)} | ${percentile(next, 0.95).toFixed(0)} |\n`,
    );
  }
  assert.ok(sink > 0);
}
