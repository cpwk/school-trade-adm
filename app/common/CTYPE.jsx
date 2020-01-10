let CTYPE = (() => {

    let maxlength = {title: 140, intro: 500};

    let minlength = {title: 1, intro: 1};

    let eidtMaxWidth = 1800;

    let eidtMinWidth = 900;

    let formStyle = {minWidth: eidtMinWidth, maxWidth: eidtMaxWidth, marginTop: '20px'};

    return {

        minprice: 0,
        maxprice: 1000000,

        eidtMaxWidth: 1800,

        eidtMinWidth: 900,

        maxlength: maxlength,

        minlength: minlength,
        pagination: {pageSize: 20},

        formStyle,

        commonPagination: {showQuickJumper: true, showSizeChanger: true, showTotal: total => `总共 ${total} 条`},

        fieldDecorator_rule_title: {
            type: 'string',
            required: true,
            message: `标题长度为${minlength.title}~${maxlength.title}个字`,
            whitespace: true,
            min: minlength.title,
            max: maxlength.title
        },

        expirePeriods: [{key: '1D', label: '一天'},
            {key: '3D', label: '三天'},
            {key: '1W', label: '一周'},
            {key: '1M', label: '一个月'},
            {key: '3M', label: '三个月'},
            {key: '6M', label: '六个月'},
            {key: '1Y', label: '一年'},
            {key: '2Y', label: '两年'},
            {key: '3Y', label: '三年'},
            {key: '5Y', label: '五年'},
            {key: '10Y', label: '十年'}],

        link: {
            info_banners: {key: '/app/info/banners', path: '/app/info/banners', txt: 'Banner列表'},

            info_product: {key: '/app/info/product', path: '/app/info/product', txt: '商品管理'},
            product_edit: {key: '/app/info/product-edit', path: '/app/info/product-edit', txt: '编辑商品'},

            info_sort: {key: '/app/info/sort', path: '/app/info/sort', txt: '商品类型管理'},

            info_user: {key: '/app/info/user', path: '/app/info/user', txt: '用户列表'},

            info_order: {key: '/app/info/order', path: '/app/info/order', txt: '订单列表'},

            admin_admins: {key: '/app/admin/admins', path: '/app/admin/admins', txt: '管理员'},

            admin_roles: {key: '/app/admin/roles', path: '/app/admin/roles', txt: '权限组'},

            info_coupon: {key: '/app/info/coupon', path: '/app/info/coupon', txt: '优惠券列表'},

            comment: {key: '/app/comment', path: '/app/comment', txt: '评论列表'},

            vip: {key: '/app/info/vip', path: '/app/info/vip', txt: '会员设置'},
            vip_user: {key: '/app/info/vip-user', path: '/app/info/vip-user', txt: '会员列表'},

            merchant_merchants: {key: '/app/merchant/merchants', path: '/app/merchant/merchants', txt: '店铺管理'},

        },

        //图片裁切工具比例
        imgeditorscale: {
            square: 1,
            rectangle_v: 1.7778,
            rectangle_h: 0.5625,
        },

        formItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        dialogItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        shortFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 4},
                sm: {span: 3},
            },
        },
        longFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        tailFormItemLayout: {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 3,
                },
            },
        },

        bannerTypes: [{type: 1, label: 'PC首页'}]
    }
})();

export default CTYPE;