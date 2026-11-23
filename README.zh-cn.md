# 开发插件

点击 Use this template 创建自己的仓库，然后运行 README 中的初始化命令替换插件身份。模板提供固定版本 SDK、真实 stdio 测试、确定性 ZIP 打包和独立发布工作流。安装时不运行 npm、不下载依赖。

发布前写明宿主最低版本、Node 授权、所需权限和数据访问行为。发布 vX.Y.Z 后，将 marketplace.json 元数据及仓库映射提交到 Hub；Hub 校验真实发布资产后只分发链接，后续自动提出版本更新 PR。
