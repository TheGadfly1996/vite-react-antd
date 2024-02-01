export interface BlogLists {
	coverData?: {
		type: 'video' | 'image' | string
		link: string
		contentVal: string
	} // 列表封面
	/**
	 * 帖子用户id
	 */
	blog_author: string
	/**
	 * 帖子id
	 */
	blog_id: string
	/**
	 * 帖子评论数
	 */
	com_total: number
	/**
	 * 帖子内容
	 */
	content: Array<any>
	/**
	 * 发帖时间
	 */
	create_time: string
	/**
	 * 帖子用户头像
	 */
	icon_url: string
	/**
	 * ip属地
	 */
	ip_territory: string
	/**
	 * 当前点赞状态
	 */
	like_status: number | boolean
	/**
	 * 帖子点赞数
	 */
	like_total: number
	/**
	 * 板块信息
	 */
	plate_data: {
		/**
		 * 板块id
		 */
		plate_id: string
		/**
		 * 板块英文名
		 */
		plate_name_en: string
		/**
		 * 板块中文名
		 */
		plate_name_zh: string
	}
	/**
	 * 帖子资源文件
	 */
	resource_data: {
		/**
		 * 下载次数
		 */
		download_number: string
		/**
		 * 资源文件名
		 */
		filename: string
		/**
		 * 资源id
		 */
		res_id: string
		/**
		 * 资源标题
		 */
		res_tile: string
		/**
		 * 资源ID
		 */
		oss_id: string
	}
	/**
	 * 审核详情
	 */
	review_type: {
		/**
		 * 内容审核状态，0 审核未通过  1审核通过
		 */
		content: number
		/**
		 * 图片审核状态，0 审核未通过  1审核通过
		 */
		image?: number
		/**
		 * 标题审核状态，0 审核未通过  1审核通过
		 */
		title: number
		/**
		 * 视频审核状态，0 审核未通过  1审核通过
		 */
		video?: number
	}
	/**
	 * 0 审核未通过 1 审核通过 2 审核中 3 视频转码中 4 等待人工审核
	 */
	status: number
	/**
	 * 帖子标题
	 */
	title: string
	/**
	 * 帖子浏览数
	 */
	total_browse: number
	/**
	 * 帖子用户名
	 */
	username: string
}
export interface HomeResult {
	[key: string]: Array<BlogLists>
}
export interface Blogs {
	blog_id: string
	title: string
}
export interface Recommend {
	plate_id: string
	plate_name_zh: string
	plate_name_en: string
	plate_desc: string
	blogs: Blogs[]
}
export interface RecommendResponseData {
	count: number
	plate_list: Recommend[]
}
export interface ChallengesResponseData {
	count: number
	announcements: Blogs[]
}
export interface BannerResponseData {
	banner_desc: string
	banner_id: string
	banner_url: string
	banner_link: string | null
}
