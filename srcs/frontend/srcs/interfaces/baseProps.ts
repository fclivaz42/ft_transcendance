export interface BaseProps {
  id?: string;
  i18n?: string;
}

export interface TitleProps extends BaseProps {
  title: string;
}

export interface ButtonProps extends Partial<TitleProps> {
  logo?: string;
	f?: () => void;
	color?: string;
  darkColor?: string;
	href?: string;
	addClasses?:string;
}
