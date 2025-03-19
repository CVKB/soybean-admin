<div align="center">
	<img src="./public/favicon.svg" width="160" />
	<h1>SoybeanAdmin</h1>
  <span>中文 | <a href="./README.en_US.md">English</a></span>
</div>

---
该hook对 router.push 进行二次封装，主要目的是代替 router.push 使用，通过该hook可更便捷得进行跳转， useRouterPush 返回一个对象，包含以下属性和方法：

routerPush: Vue Router 的 push 方法。
routerBack: Vue Router 的 back 方法。
routerPushByKey: 根据路由key跳转的方法。
toLogin: 跳转到登录页的方法。
toggleLoginModule: 切换登录模块的方法。
redirectFromLogin: 从登录页重定向的方法。

-- 注意
` 在 setup 外使用时需要给 useRouterPush 传入 false。