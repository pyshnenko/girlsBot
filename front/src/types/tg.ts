interface MainButtonParams {
  text?: string;
  color?: Color;
  text_color?: Color;
  has_shine_effect?: boolean;
  position?: 'left' | 'right' | 'top' | 'bottom';
  is_active?: boolean;
  is_visible?: boolean;
}

interface BottomButton {
  onClick(callback: () => void): BottomButton;
  show(): BottomButton;
  setParams(params: MainButtonParams): BottomButton;
}

export default interface TGtype {
  WebApp: {
    SecondaryButton: BottomButton;
    sendData(data: string): void;
    colorScheme: 'dark' | 'light';
  };
}
