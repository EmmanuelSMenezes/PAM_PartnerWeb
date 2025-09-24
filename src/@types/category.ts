export interface iCategory {
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

export interface iCategoryPost {
  description: string;
  category_parent_id: string | null;
  created_by: string;
}

export interface iCategoryResponse {
  category: [
    {
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
  ];
  paginations: Paginations;
}

export interface iCategoryPage {
  categories: [
    {
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
  ];
  paginations: Paginations;
}
export interface Paginations {
  totalRows: number;
  totalPages: number;
}
export interface iUpdateCategory {
  category_id: string | string[] | undefined;
  description: string;
  category_parent_id: string | null;
  active: boolean;
  updated_by: string;
}
