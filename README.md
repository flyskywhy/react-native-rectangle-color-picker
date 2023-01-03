## react-native-rectangle-color-picker

[![npm version](http://img.shields.io/npm/v/react-native-rectangle-color-picker.svg?style=flat-square)](https://npmjs.org/package/react-native-rectangle-color-picker "View this project on npm")
[![npm downloads](http://img.shields.io/npm/dm/react-native-rectangle-color-picker.svg?style=flat-square)](https://npmjs.org/package/react-native-rectangle-color-picker "View this project on npm")
[![npm licence](http://img.shields.io/npm/l/react-native-rectangle-color-picker.svg?style=flat-square)](https://npmjs.org/package/react-native-rectangle-color-picker "View this project on npm")
[![Platform](https://img.shields.io/badge/platform-ios%20%7C%20android-989898.svg?style=flat-square)](https://npmjs.org/package/react-native-rectangle-color-picker "View this project on npm")

A color picker on diamond or rectangle palette.

<img src="https://raw.githubusercontent.com/flyskywhy/react-native-rectangle-color-picker/master/Screenshots/android_diamond_with_staticPalette.png" width="375">
<img src="https://raw.githubusercontent.com/flyskywhy/react-native-rectangle-color-picker/master/Screenshots/android_rectangle_with_staticPalette.png" width="375">
<img src="https://raw.githubusercontent.com/flyskywhy/react-native-rectangle-color-picker/master/Screenshots/android_rectangle_without_staticPalette.png" width="375">

## Install

For RN >= 0.60
```shell
npm i --save react-native-rectangle-color-picker react-native-gesture-handler
```

For RN < 0.60
```shell
npm i --save react-native-rectangle-color-picker@1.x react-native-gesture-handler@1.2.2
```

And be aware of https://github.com/software-mansion/react-native-gesture-handler/issues/1164 if you use react-native-web and want to slide on web.

## Usage

```jsx
import React from 'react';
import { View } from 'react-native';
import tinycolor from 'tinycolor2';
import ColorPicker from 'react-native-rectangle-color-picker';

export default class SliderColorPickerExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = { oldColor: '#dc402b' };
    }

    componentDidMount() {
        setTimeout(() => this.setState({ oldColor: '#fde200' }), 1000);
    }

    changeColor = colorHsv => this.setState({ oldColor: tinycolor(colorHsv).toHexString() })

    render() {
        return (
            <View style={{alignItems: 'center'}}>
                <ColorPicker
                    ref={view => {this.colorPicker = view;}}
                    oldColor={this.state.oldColor}
                    onColorChange={this.changeColor}
                    textSaturation={'Saturation'}
                    diamond={true}
                    staticPalette={true}/>
            </View>
        );
    }
}
```

## Props

Prop                  | Type     | Optional | Default                   | Description
--------------------- | -------- | -------- | ------------------------- | -----------
oldColor              | [Color string](https://github.com/bgrins/TinyColor#accepted-string-input) | Yes      | undefined                 | Initial positon of the picker indicator
onColorChange         | function | Yes      |                           | Callback called while the user click a color or release the slider. The 1st argument is color in HSV representation (see below). The 2nd string argument is always 'end'.
hideSliders           | bool     | Yes      | false                     | Set this to true to hide the saturation sliders.
textSaturation        | string   | Yes      | 'Saturation'              | Set the title text of the saturation slider.
diamond               | bool     | Yes      | true                      | Show diamond or rectangle palette.
staticPalette         | bool     | Yes      | true                      | Set this to false to let the slider change the saturation of palette.

HSV color representation is an object literal with properties:

```javascript
{
    h: number, // <0, 360>
    s: number, // <0, 1>
    v: number, // <0, 1>
}

```

## Donate
To support my work, please consider donate.

- ETH: 0xd02fa2738dcbba988904b5a9ef123f7a957dbb3e

- <img src="https://raw.githubusercontent.com/flyskywhy/flyskywhy/main/assets/alipay_weixin.png" width="500">
