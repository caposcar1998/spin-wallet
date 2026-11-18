import type { StorybookConfig } from "@storybook/nextjs";
import { fileURLToPath } from "node:url";
import webpack from "webpack";

const mock = (name: string) =>
  fileURLToPath(new URL(`./mocks/${name}.ts`, import.meta.url));

const config: StorybookConfig = {
  stories: ["../**/*.stories.@(ts|tsx)"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    // El preset de Next define un alias "@" que resuelve antes que claves
    // exactas en resolve.alias; NormalModuleReplacementPlugin intercepta el
    // specifier crudo y no depende del orden de resolución.
    const absoluteMocks: Record<string, string> = {
      "@/app/transactions/actions": mock("transactionActions"),
      "@/lib/users": mock("users"),
      "@/lib/session": mock("session"),
    };
    config.plugins!.push(
      new webpack.NormalModuleReplacementPlugin(
        /^\.\/actions$|^@\/app\/transactions\/actions$|^@\/lib\/(session|users)$/,
        (resource) => {
          const replacement = absoluteMocks[resource.request];
          if (replacement) {
            resource.request = replacement;
            return;
          }
          const issuer = resource.contextInfo?.issuer ?? "";
          if (issuer.includes("app/login")) {
            resource.request = mock("loginActions");
          } else if (issuer.includes("app/transactions")) {
            resource.request = mock("transactionActions");
          }
        },
      ),
    );
    return config;
  },
};
export default config;
