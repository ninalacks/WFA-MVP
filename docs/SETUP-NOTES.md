# Setup Notes

## Component library: Radix UI (headless)

The PRD tech stack lists "KTD Design Library Components" (Kroger's internal design
system), but its npm package name/registry could not be determined from the public
gallery at https://design.kroger.com/components?community=MX&platform=Web, which
exposes no install instructions.

Decision: use [Radix UI](https://www.radix-ui.com/primitives) (`radix-ui` package)
instead — unstyled, accessible headless primitives styled with the project's
Tailwind CSS setup. Installed via `npm install radix-ui`, which bundles all
primitives under one package with per-component subpath imports
(e.g. `import { Dialog } from "radix-ui"`).

If KTD access becomes available later, its styled components can be adopted
alongside or in place of specific Radix primitives on a per-component basis.
