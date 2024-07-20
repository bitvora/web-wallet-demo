import { type ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorBgMask: 'rgb(0, 0, 0, 0.9)',
    colorBorder: '#9791A1',
    colorBgContainer: 'transparent',
    colorPrimary: '#5C487F'
  },
  components: {
    Table: {
      colorBgContainer: 'transparent',
      headerBg: '#221e2b',
      headerColor: '#C69A71',
      headerSplitColor: 'transparent',
      borderColor: '#9791A1',
      colorText: '#9791A1',
      colorSplit: 'transparent',
      lineWidth: 0.5,
      rowHoverBg: '#0C0911',
      fontSize: 13,
      margin: 8
    },
    Segmented: {
      itemActiveBg: '#15101E',
      itemColor: '#9791A1',
      itemHoverBg: '#15101E',
      itemHoverColor: '#EFEDF1',
      itemSelectedBg: '#15101E',
      itemSelectedColor: '#EFEDF1',
      trackBg: '#0C0911'
    },
    Timeline: {
      tailColor: '#221e2b',
      tailWidth: 1
    }
  }
};

export default theme;
