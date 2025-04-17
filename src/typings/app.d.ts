/** 应用的全局命名空间 */
declare namespace App {
  /** 主题命名空间 */
  namespace Theme {
    type ColorPaletteNumber = import('@sa/color').ColorPaletteNumber;

    /** 主题设置 */
    interface ThemeSetting {
      /** 主题方案 */
      themeScheme: UnionKey.ThemeScheme;
      /** 灰度模式 */
      grayscale: boolean;
      /** 色弱模式 */
      colourWeakness: boolean;
      /** 是否推荐颜色 */
      recommendColor: boolean;
      /** 主题颜色 */
      themeColor: string;
      /** 其他颜色 */
      otherColor: OtherColor;
      /** 信息颜色是否跟随主色 */
      isInfoFollowPrimary: boolean;
      /** 重置缓存策略 */
      resetCacheStrategy: UnionKey.ResetCacheStrategy;
      /** 布局设置 */
      layout: {
        /** 布局模式 */
        mode: UnionKey.ThemeLayoutMode;
        /** 滚动模式 */
        scrollMode: UnionKey.ThemeScrollMode;
        /**
         * 是否反转水平混合布局
         *
         * 如果为true，左侧显示垂直子菜单，顶部显示水平一级菜单
         */
        reverseHorizontalMix: boolean;
      };
      /** 页面设置 */
      page: {
        /** 是否显示页面过渡动画 */
        animate: boolean;
        /** 页面动画模式 */
        animateMode: UnionKey.ThemePageAnimateMode;
      };
      /** 头部设置 */
      header: {
        /** 头部高度 */
        height: number;
        /** 面包屑设置 */
        breadcrumb: {
          /** 是否显示面包屑 */
          visible: boolean;
          /** 是否显示面包屑图标 */
          showIcon: boolean;
        };
        /** 多语言设置 */
        multilingual: {
          /** 是否显示多语言 */
          visible: boolean;
        };
      };
      /** 标签页设置 */
      tab: {
        /** 是否显示标签页 */
        visible: boolean;
        /**
         * 是否缓存标签页
         *
         * 如果缓存，页面刷新时会从本地存储中获取标签页
         */
        cache: boolean;
        /** 标签页高度 */
        height: number;
        /** 标签页模式 */
        mode: UnionKey.ThemeTabMode;
      };
      /** 固定头部和标签页 */
      fixedHeaderAndTab: boolean;
      /** 侧边栏设置 */
      sider: {
        /** 反转侧边栏颜色 */
        inverted: boolean;
        /** 侧边栏宽度 */
        width: number;
        /** 折叠侧边栏宽度 */
        collapsedWidth: number;
        /** 混合布局时的侧边栏宽度 */
        mixWidth: number;
        /** 混合布局时的折叠侧边栏宽度 */
        mixCollapsedWidth: number;
        /** 混合布局时的子菜单宽度 */
        mixChildMenuWidth: number;
      };
      /** 底部设置 */
      footer: {
        /** 是否显示底部 */
        visible: boolean;
        /** 是否固定底部 */
        fixed: boolean;
        /** 底部高度 */
        height: number;
        /** 在水平混合布局时是否浮动到底部右侧 */
        right: boolean;
      };
      /** 水印设置 */
      watermark: {
        /** 是否显示水印 */
        visible: boolean;
        /** 水印文字 */
        text: string;
      };
      /** 定义一些主题设置令牌，将转换为CSS变量 */
      tokens: {
        light: ThemeSettingToken;
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
        };
      };
    }

    /** 其他颜色 */
    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    /** 主题颜色 */
    interface ThemeColor extends OtherColor {
      primary: string;
    }

    /** 主题颜色键 */
    type ThemeColorKey = keyof ThemeColor;

    /** 主题调色板颜色 */
    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    /** 基础令牌 */
    type BaseToken = Record<string, Record<string, string>>;

    /** 主题设置令牌颜色 */
    interface ThemeSettingTokenColor {
      /** 进度条颜色，如果未设置，则使用主色 */
      nprogress?: string;
      container: string;
      layout: string;
      inverted: string;
      'base-text': string;
    }

    /** 主题设置令牌阴影 */
    interface ThemeSettingTokenBoxShadow {
      header: string;
      sider: string;
      tab: string;
    }

    /** 主题设置令牌 */
    interface ThemeSettingToken {
      colors: ThemeSettingTokenColor;
      boxShadow: ThemeSettingTokenBoxShadow;
    }

    /** 主题令牌颜色 */
    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor;

    /** 主题令牌CSS变量 */
    type ThemeTokenCSSVars = {
      colors: ThemeTokenColor & { [key: string]: string };
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string };
    };
  }

  /** 全局命名空间 */
  namespace Global {
    type VNode = import('vue').VNode;
    type RouteLocationNormalizedLoaded = import('vue-router').RouteLocationNormalizedLoaded;
    type RouteKey = import('@elegant-router/types').RouteKey;
    type RouteMap = import('@elegant-router/types').RouteMap;
    type RoutePath = import('@elegant-router/types').RoutePath;
    type LastLevelRouteKey = import('@elegant-router/types').LastLevelRouteKey;

    /** 全局头部属性 */
    interface HeaderProps {
      /** 是否显示logo */
      showLogo?: boolean;
      /** 是否显示菜单切换按钮 */
      showMenuToggler?: boolean;
      /** 是否显示菜单 */
      showMenu?: boolean;
    }

    /** 全局菜单 */
    type Menu = {
      /**
       * 菜单键
       *
       * 等同于路由键
       */
      key: string;
      /** 菜单标签 */
      label: string;
      /** 菜单国际化键 */
      i18nKey?: I18n.I18nKey | null;
      /** 路由键 */
      routeKey: RouteKey;
      /** 路由路径 */
      routePath: RoutePath;
      /** 菜单图标 */
      icon?: () => VNode;
      /** 菜单子项 */
      children?: Menu[];
    };

    /** 面包屑 */
    type Breadcrumb = Omit<Menu, 'children'> & {
      options?: Breadcrumb[];
    };

    /** 标签页路由 */
    type TabRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'path' | 'meta'> &
      Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query' | 'matched'>>;

    /** 全局标签页 */
    type Tab = {
      /** 标签页ID */
      id: string;
      /** 标签页标签 */
      label: string;
      /**
       * 新标签页标签
       *
       * 如果设置，标签页标签将被此值替换
       */
      newLabel?: string;
      /**
       * 旧标签页标签
       *
       * 重置标签页标签时，标签页标签将被此值替换
       */
      oldLabel?: string;
      /** 标签页路由键 */
      routeKey: LastLevelRouteKey;
      /** 标签页路由路径 */
      routePath: RouteMap[LastLevelRouteKey];
      /** 标签页完整路径 */
      fullPath: string;
      /** 标签页固定索引 */
      fixedIndex?: number | null;
      /**
       * 标签页图标
       *
       * Iconify图标
       */
      icon?: string;
      /**
       * 标签页本地图标
       *
       * 本地图标
       */
      localIcon?: string;
      /** 国际化键 */
      i18nKey?: I18n.I18nKey | null;
    };

    /** 表单规则 */
    type FormRule = import('naive-ui').FormItemRule;

    /** 全局下拉菜单键 */
    type DropdownKey = 'closeCurrent' | 'closeOther' | 'closeLeft' | 'closeRight' | 'closeAll';
  }

  /**
   * 国际化命名空间
   *
   * 语言类型
   */
  namespace I18n {
    type RouteKey = import('@elegant-router/types').RouteKey;

    /** 语言类型 */
    type LangType = 'en-US' | 'zh-CN';

    /** 语言选项 */
    type LangOption = {
      label: string;
      key: LangType;
    };

    /** 国际化路由键 */
    type I18nRouteKey = Exclude<RouteKey, 'root' | 'not-found'>;

    /** 表单消息 */
    type FormMsg = {
      required: string;
      invalid: string;
    };

    /** 国际化模式 */
    type Schema = {
      system: {
        title: string;
        updateTitle: string;
        updateContent: string;
        updateConfirm: string;
        updateCancel: string;
      };
      common: {
        action: string;
        add: string;
        addSuccess: string;
        backToHome: string;
        batchDelete: string;
        cancel: string;
        close: string;
        check: string;
        expandColumn: string;
        columnSetting: string;
        config: string;
        confirm: string;
        delete: string;
        deleteSuccess: string;
        confirmDelete: string;
        edit: string;
        warning: string;
        error: string;
        index: string;
        keywordSearch: string;
        logout: string;
        logoutConfirm: string;
        lookForward: string;
        modify: string;
        modifySuccess: string;
        noData: string;
        operate: string;
        pleaseCheckValue: string;
        refresh: string;
        reset: string;
        search: string;
        switch: string;
        tip: string;
        trigger: string;
        update: string;
        updateSuccess: string;
        userCenter: string;
        yesOrNo: {
          yes: string;
          no: string;
        };
      };
      request: {
        logout: string;
        logoutMsg: string;
        logoutWithModal: string;
        logoutWithModalMsg: string;
        refreshToken: string;
        tokenExpired: string;
      };
      theme: {
        themeSchema: { title: string } & Record<UnionKey.ThemeScheme, string>;
        grayscale: string;
        colourWeakness: string;
        layoutMode: { title: string; reverseHorizontalMix: string } & Record<UnionKey.ThemeLayoutMode, string>;
        recommendColor: string;
        recommendColorDesc: string;
        themeColor: {
          title: string;
          followPrimary: string;
        } & Theme.ThemeColor;
        scrollMode: { title: string } & Record<UnionKey.ThemeScrollMode, string>;
        page: {
          animate: string;
          mode: { title: string } & Record<UnionKey.ThemePageAnimateMode, string>;
        };
        fixedHeaderAndTab: string;
        header: {
          height: string;
          breadcrumb: {
            visible: string;
            showIcon: string;
          };
          multilingual: {
            visible: string;
          };
        };
        tab: {
          visible: string;
          cache: string;
          height: string;
          mode: { title: string } & Record<UnionKey.ThemeTabMode, string>;
        };
        sider: {
          inverted: string;
          width: string;
          collapsedWidth: string;
          mixWidth: string;
          mixCollapsedWidth: string;
          mixChildMenuWidth: string;
        };
        footer: {
          visible: string;
          fixed: string;
          height: string;
          right: string;
        };
        watermark: {
          visible: string;
          text: string;
        };
        themeDrawerTitle: string;
        pageFunTitle: string;
        resetCacheStrategy: { title: string } & Record<UnionKey.ResetCacheStrategy, string>;
        configOperation: {
          copyConfig: string;
          copySuccessMsg: string;
          resetConfig: string;
          resetSuccessMsg: string;
        };
      };
      route: Record<I18nRouteKey, string>;
      page: {
        login: {
          common: {
            loginOrRegister: string;
            userNamePlaceholder: string;
            phonePlaceholder: string;
            codePlaceholder: string;
            passwordPlaceholder: string;
            confirmPasswordPlaceholder: string;
            codeLogin: string;
            confirm: string;
            back: string;
            validateSuccess: string;
            loginSuccess: string;
            welcomeBack: string;
          };
          pwdLogin: {
            title: string;
            rememberMe: string;
            forgetPassword: string;
            register: string;
            otherAccountLogin: string;
            otherLoginMode: string;
            superAdmin: string;
            admin: string;
            user: string;
          };
          codeLogin: {
            title: string;
            getCode: string;
            reGetCode: string;
            sendCodeSuccess: string;
            imageCodePlaceholder: string;
          };
          register: {
            title: string;
            agreement: string;
            protocol: string;
            policy: string;
          };
          resetPwd: {
            title: string;
          };
          bindWeChat: {
            title: string;
          };
        };
        home: {
          branchDesc: string;
          greeting: string;
          weatherDesc: string;
          projectCount: string;
          todo: string;
          message: string;
          downloadCount: string;
          registerCount: string;
          schedule: string;
          study: string;
          work: string;
          rest: string;
          entertainment: string;
          visitCount: string;
          turnover: string;
          dealCount: string;
          projectNews: {
            title: string;
            moreNews: string;
            desc1: string;
            desc2: string;
            desc3: string;
            desc4: string;
            desc5: string;
          };
          creativity: string;
        };
      };
      form: {
        required: string;
        userName: FormMsg;
        phone: FormMsg;
        pwd: FormMsg;
        confirmPwd: FormMsg;
        code: FormMsg;
        email: FormMsg;
      };
      dropdown: Record<Global.DropdownKey, string>;
      icon: {
        themeConfig: string;
        themeSchema: string;
        lang: string;
        fullscreen: string;
        fullscreenExit: string;
        reload: string;
        collapse: string;
        expand: string;
        pin: string;
        unpin: string;
      };
      datatable: {
        itemCount: string;
      };
    };

    /** 获取国际化键 */
    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never;

    /** 国际化键 */
    type I18nKey = GetI18nKey<Schema>;

    /** 翻译选项 */
    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>;

    /** 翻译函数接口 */
    interface $T {
      (key: I18nKey): string;
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], plural: number): string;
      (key: I18nKey, list: unknown[], defaultMsg: string): string;
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, named: Record<string, unknown>, plural: number): string;
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    }
  }

  /** 服务命名空间 */
  namespace Service {
    /** 其他基础URL键 */
    type OtherBaseURLKey = 'demo';

    /** 服务配置项 */
    interface ServiceConfigItem {
      /** 后端服务基础URL */
      baseURL: string;
      /** 后端服务基础URL的代理模式 */
      proxyPattern: string;
    }

    /** 其他服务配置项 */
    interface OtherServiceConfigItem extends ServiceConfigItem {
      key: OtherBaseURLKey;
    }

    /** 后端服务配置 */
    interface ServiceConfig extends ServiceConfigItem {
      /** 其他后端服务配置 */
      other: OtherServiceConfigItem[];
    }

    /** 简化版服务配置 */
    interface SimpleServiceConfig extends Pick<ServiceConfigItem, 'baseURL'> {
      other: Record<OtherBaseURLKey, string>;
    }

    /** 后端服务响应数据 */
    type Response<T = unknown> = {
      /** 后端服务响应码 */
      code: string;
      /** 后端服务响应消息 */
      msg: string;
      /** 后端服务响应数据 */
      data: T;
    };

    /** 演示后端服务响应数据 */
    type DemoResponse<T = unknown> = {
      /** 后端服务响应状态 */
      status: string;
      /** 后端服务响应消息 */
      message: string;
      /** 后端服务响应结果 */
      result: T;
    };
  }
}
