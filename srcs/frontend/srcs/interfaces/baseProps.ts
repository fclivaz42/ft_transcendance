export interface BaseProps {
  id?: string;
  i18n?: string;
}

export interface TitleProps extends BaseProps {
  title: string;
}

export interface ButtonProps extends BaseProps {
  logo?: string;
	f?: () => void;
	color?: string;
  darkColor?: string;
	href?: string;
	addClasses?:string;
	logoSize?: string;
}
