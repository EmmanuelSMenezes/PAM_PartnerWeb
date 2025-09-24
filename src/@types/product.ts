import { CustomFile } from 'src/components/upload';

export type ProductListParams = {
  branch_id?: string;
  page: number;
  itensPerPage: number | string;
  filter?: string;
  partner_id?: string | null;
};

export type ProductDeleteParam = {
  product_id: string;
};

export type ProductCreateParams = {
  base_product_id?: string;
  branch_id?: string;
  sale_price?: number | any;
  product_id?: string;
  name?: string;
  reviewer?: boolean;
  partner_id?: string | null;
  description?: string;
  price?: number;
  minimum_price?: number;
  active?: boolean;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  images?: CustomFile[] | File[];
  imagedefaultname?: string;
};

export type PartnerAvatarParams = {
  admin_id: string;
  user: {
    user_id: string;
    admin_id: string;
    email: string;
    phone: string;
    active: boolean;
    role_id: string;
    password_generated: boolean;
    last_login: string;
    created_at: string;
    deleted_at: string;
    updated_at: string;
    role: {
      role_id: string;
      description: string;
      tag: string;
      active: boolean;
      created_at: string;
      deleted_at: string;
      updated_at: string;
    };
    profile: {
      profile_id: string;
      fullname: string;
      avatar: string;
      document: string;
      active: boolean;
      created_at: string;
      deleted_at: string;
      updated_at: string;
      user_id: string;
    };
  };
  token: string;
  user_id: string;
};

export interface iProductImage {
  partner_id?: string;
  product_id?: string;
  images: (CustomFile | File)[];
  imagedefaultname?: string;
  size?: string;
}

export interface IPartnerAvatar {
  avatar: File | CustomFile | string;
  type?: string;
  user_id?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  document?: string;
}

export type IProductReview = {
  id: string;
  name: string;
  avatarUrl: string;
  comment: string;
  rating: number;
  isPurchased: boolean;
  helpful: number;
  postedAt: Date | string | number;
};

export type IProduct = {
  id: string;
  cover?: string;
  active?: boolean;
  sale_price: number;
  updated_by?: string;
  product_id?: string | undefined;
  images: {
    product_image_id: string;
    url: string;
  }[];
  name: string;
  minimum_price?: number;
  price: number;
  image_default?: string;
  code?: string;
  sku: string;
  tags?: string;
  priceSale: number | null;
  totalRating?: number;
  totalReview?: number;
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  reviews: IProductReview[];
  colors: string[];
  status?: string;
  extraInfos?: string;
  reviewer: boolean;
  inventoryType: string;
  sizes: string[];
  note?: string;
  available: number;
  description?: string;
  sold: number;
  createdAt: Date | string | number;
  categories: [
    {
      category_id: string;
      category_parent_id: string;
    }
  ];
  gender?: string;
};

export type IProductFilter = {
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
  rating: string;
  sortBy: string;
};

// ----------------------------------------------------------------------

export type ICheckoutCartItem = {
  id: string;
  name: string;
  cover: string;
  available: number;
  price: number;
  colors: string[];
  size: string;
  quantity: number;
  subtotal: number;
};

export type ICheckoutBillingAddress = {
  receiver: string;
  phoneNumber: string;
  fullAddress: string;
  addressType: string;
  isDefault: boolean;
};

export type ICheckoutDeliveryOption = {
  value: number;
  title: string;
  description: string;
};

export type ICheckoutPaymentOption = {
  value: string;
  title: string;
  description: string;
  icons: string[];
};

export type ICheckoutCardOption = {
  value: string;
  label: string;
};

// ----------------------------------------------------------------------

export type IProductCheckoutState = {
  activeStep: number;
  cart: ICheckoutCartItem[];
  subtotal: number;
  total: number;
  discount: number;
  shipping: number;
  billing: ICheckoutBillingAddress | null;
  totalItems: number;
};

export type IProductState = {
  isLoading: boolean;
  error: Error | string | null;
  products: IProduct[];
  product: IProduct | null;
  checkout: IProductCheckoutState;
};

// interface para trazer os produtos a partir da branchId

export interface IProductList {
  product_id: string;
  identifier: number;
  name: string;
  description: string;
  note: string;
  minimum_price: number;
  active: boolean;
  type: string;
  categories: Category[];
  admin_id: string;
  url: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface Category {
  category_id: string;
  identifier: number;
  description: string;
  category_parent_name: string;
  category_parent_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface Pagination {
  totalRows: number;
  totalPages: number;
}
