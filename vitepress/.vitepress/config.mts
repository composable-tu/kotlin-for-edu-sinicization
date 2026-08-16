import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";

// GitHub Pages 项目站点部署在子路径下，需用环境变量注入 base。
// 本地 `pnpm docs:dev` 保持 "/"，CI 中通过 BASE_PATH 覆盖为 "/kotlin-for-edu-sinicization/"。
const base = process.env.BASE_PATH ?? "/";

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    base,
    title: "Kotlin for Edu - Sinicization",
    description: "对 Kotlin for Education 教育工具包材料的中文化 —— 当然，不包括评估材料",
    themeConfig: {
      nav: [
        { text: "首页", link: "/" },
        {
          text: "课件讲义",
          link: "/kotlin-edu-sinicization/kotlin-edu-l10n",
          activeMatch: "/kotlin-edu-sinicization/",
        },
      ],
      sidebar: {
        "/kotlin-edu-sinicization/": [
          {
            text: "概览",
            items: [
              { text: "Kotlin for Education - 中文化", link: "/kotlin-edu-sinicization/kotlin-edu-l10n" },
              { text: "为什么要教 Kotlin？", link: "/kotlin-edu-sinicization/why-teach-kotlin" },
              { text: "《Kotlin 编程》课程大纲", link: "/kotlin-edu-sinicization/course-syllabus" },
            ],
          },
          {
            text: "大纲一",
            items: [
              { text: "Kotlin 入门", link: "/kotlin-edu-sinicization/introduction-to-kotlin" },
              { text: "面向对象编程", link: "/kotlin-edu-sinicization/object-oriented-programming" },
              { text: "泛型", link: "/kotlin-edu-sinicization/generics" },
              { text: "集合", link: "/kotlin-edu-sinicization/collections" },
              { text: "函数式编程", link: "/kotlin-edu-sinicization/functional-programming" },
            ],
          },
          {
            text: "大纲二",
            items: [
              {
                text: "并行与并发编程",
                link: "/kotlin-edu-sinicization/parallel-and-concurrent-programming",
              },
              { text: "异步编程", link: "/kotlin-edu-sinicization/asynchronous-programming" },
            ],
          },
          {
            text: "选修",
            items: [
              { text: "异常", link: "/kotlin-edu-sinicization/exceptions" },
              { text: "测试", link: "/kotlin-edu-sinicization/testing" },
            ],
          },
          {
            text: "进阶",
            items: [
              { text: "构建系统", link: "/kotlin-edu-sinicization/build-systems" },
              {
                text: "Java 虚拟机与 Kotlin 编译器",
                link: "/kotlin-edu-sinicization/jvm-and-the-kotlin-compiler",
              },
              { text: "反射（JVM）", link: "/kotlin-edu-sinicization/reflection" },
            ],
          },
          {
            text: "其它",
            items: [
              { text: "Kotlin 后端开发基础", link: "/kotlin-edu-sinicization/backend-development-basics" },
            ],
          },
        ],
      },
      socialLinks: [{ icon: "github", link: "https://github.com/composable-tu/kotlin-for-edu-sinicization" }],
      editLink: {
        pattern: "https://github.com/composable-tu/kotlin-for-edu-sinicization/edit/main/vitepress/:path",
        text: "为此文档提交贡献",
      },
      lastUpdated: { text: "上次更新", formatOptions: { dateStyle: "full", timeStyle: "medium" } },
      search: {
        provider: "local",
        options: {
          translations: {
            button: { buttonText: "搜索", buttonAriaLabel: "搜索" },
            modal: {
              noResultsText: "找不到相关结果",
              resetButtonTitle: "清除搜索词",
              displayDetails: "显示详情",
              footer: { selectText: "选择", navigateText: "切换", closeText: "关闭" },
            },
          },
        },
      },
      docFooter: { prev: "上一页", next: "下一页" },
      darkModeSwitchLabel: "主题",
      lightModeSwitchTitle: "浅色模式",
      darkModeSwitchTitle: "深色模式",
      returnToTopLabel: "返回顶部",
      sidebarMenuLabel: "导航",
      externalLinkIcon: true,
      outline: { label: "文章目录", level: [2, 6] },
    },
    markdown: {
      container: {
        tipLabel: "提示",
        warningLabel: "注意",
        dangerLabel: "危险",
        infoLabel: "注释",
        detailsLabel: "展开详情",
      },
      image: { lazyLoading: true },
      config(MarkdownIt) {
        MarkdownIt.use(groupIconMdPlugin);
      },
      math: true,
    },
    vite: {
      plugins: [groupIconVitePlugin()],
    },
    ignoreDeadLinks: true,
  }),
);