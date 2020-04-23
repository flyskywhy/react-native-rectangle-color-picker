import React from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Slider from 'react-native-smooth-slider';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import tinycolor from 'tinycolor2';

export class RectangleColorPicker extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);

        let color = tinycolor(props.oldColor || props.defaultColor || '#FF0000').toHsv();

        this.perSV = props.staticPalette ? 1 / 10 : 1 / 20;
        this.perH = 360 / 15;

        if (props.staticPalette) {
            this.rectsHs = [];
            for (let i = 0; i < 1 - this.perSV; i += this.perSV) {
                let hueRects = [];
                for (let j = 0; j < 360; j += this.perH) {
                    hueRects.push({
                        h: j,
                        s: i,
                        v: 1,
                    });
                }
                this.rectsHs.push(hueRects);
            }
            this.init_rectsHs(color);
        }

        this.rects = [];
        for (let i = 1; i > 0; i -= this.perSV) {
            let hueRects = [];
            for (let j = 0; j < 360; j += this.perH) {
                hueRects.push({
                    h: j,
                    v: i,
                });
            }
            this.rects.push(hueRects);
        }
        this.init_rects(color);

        this.state = {
            rects: this.rects,
            color,
            pickerSize: null,
        };
        this._layout = {
            width: 0,
            height: 0,
        };
        this._onLayout = this._onLayout.bind(this);
    }

    static propTypes = {
        color: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                h: PropTypes.number,
                s: PropTypes.number,
                v: PropTypes.number
            }),
        ]),
        defaultColor: PropTypes.string,
        oldColor: PropTypes.string,
        onColorChange: PropTypes.func,
        hideSliders: PropTypes.bool,        // Set this to true to hide the saturation sliders
        textSaturation: PropTypes.string,   // Set the title text of the saturation slider
        diamond: PropTypes.bool,            // Show diamond or rectangle palette
        staticPalette: PropTypes.bool,      // Set this to false to let the slider change the saturation of palette
    };

    static defaultProps = {
        hideSliders: false,
        textSaturation: 'Saturation',
        diamond: true,
        staticPalette: true,
    };

    shouldComponentUpdate(nextProps, nextState = {}) {
        return !Immutable.is(Immutable.fromJS(this.props), Immutable.fromJS(nextProps))
        || !Immutable.is(Immutable.fromJS(this.state), Immutable.fromJS(nextState));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.oldColor !== this.props.oldColor) {
            this.setOldColor(nextProps.oldColor);
        }
    }

    init_rectsHs = color => {
        this.rectsHs.map((hueRects, vIndex) => {
            hueRects.map((rect, hIndex) => {
                if ((color.v === 1) &&
                    (color.s <= rect.s && color.s > rect.s - this.perSV) &&
                    (color.h >= rect.h && color.h < rect.h + this.perH)) {
                    this.vIndex = this.vIndex || vIndex;
                    this.hIndex = this.hIndex || hIndex;
                }
            });
        });
    }

    init_rects = color => {
        const {
            staticPalette,
        } = this.props;
        this.rects.map((hueRects, vIndex) => {
            hueRects.map((rect, hIndex) => {
                rect.s = staticPalette ? 1 : color.s;
                if ((color.v <= rect.v && color.v > rect.v - this.perSV) &&
                    (color.h >= rect.h && color.h < rect.h + this.perH)) {
                    this.vIndex = this.vIndex || vIndex + (staticPalette ? this.rectsHs.length : 0);
                    this.hIndex = this.hIndex || hIndex;
                }
            });
        });
    }

    _getColor() {
        const passedColor = typeof this.props.color === 'string' ?
            tinycolor(this.props.color).toHsv() :
            this.props.color;
        return passedColor || this.state.color;
    }

    _onSlidingComplete = s => {
        const {
            h,
            v
        } = this._getColor();
        let color = {
            h,
            s,
            v
        };
        if (!this.props.staticPalette) {
            this.init_rects(color);
            this.setState({
                rects: this.rects
            });
        }
        this._onColorChange(color, {
            vIndex: this.vIndex,
            hIndex: this.hIndex,
        });
    }

    _onColorChange(color, {
        vIndex,
        hIndex,
    }, resType) {
        this.vIndex = vIndex;
        this.hIndex = hIndex;
        this.setState({
            color,
        });
        if (this.props.onColorChange) {
            this.props.onColorChange(color, 'end');
        }
    }

    _onLayout(l) {
        this._layout = l.nativeEvent.layout;
        const {
            width,
            height
        } = this._layout;
        const pickerSize = Math.min(width, height);
        if (this.state.pickerSize !== pickerSize) {
            this.setState({
                pickerSize
            });
        }
    }

    getColor() {
        return tinycolor(this._getColor()).toHexString();
    }

    setOldColor = oldColor => {
        this.vIndex = undefined;
        this.hIndex = undefined;
        let color = tinycolor(oldColor).toHsv();
        if (this.props.staticPalette) {
            this.init_rectsHs(color);
        }
        this.init_rects(color);
        this.setState({
            color,
        });
    }

    renderPalette = () => {
        const {
            diamond,
            staticPalette,
        } = this.props;
        let rects = this.rects;
        if (staticPalette) {
            rects = this.rectsHs.concat(rects);
        }
        return (
            rects.map((hueRects, vIndex) => {
                let margin = 10;
                return (
                    <View style={{marginBottom: diamond ? -4.3 : 0, flexDirection: 'row'}} key={vIndex}>
                        {(diamond && (vIndex % 2)) ?
                            <View
                                style={{
                                    backgroundColor: tinycolor(hueRects[hueRects.length - 1]).toHexString(),
                                    height: 22,
                                    marginBottom: -8,
                                    marginLeft: -3,
                                    marginTop: -4,
                                    width: margin + 3,
                                }}
                            /> : null
                        }

                        {hueRects.map((rect, hIndex) => {
                            let color = tinycolor(rect).toHexString();
                            let selected = vIndex === this.vIndex && hIndex === this.hIndex;
                            let style = {
                                backgroundColor: color,
                                borderColor: selected ? 'black' : 'grey',
                                borderWidth: selected ? 1 : 0,
                                width: 15,
                                height: 15,
                                zIndex: 1,
                            };
                            if (diamond) {
                                style.marginRight = 5;
                                style.transform = [{
                                    rotate: '45deg'
                                }];
                            }
                            return (
                                <TouchableHighlight
                                    key={hIndex}
                                    onPress={this._onColorChange.bind(this, rect, {vIndex, hIndex})}
                                    style={style}
                                >
                                    <View/>
                                </TouchableHighlight>
                            );
                        })}

                        {(diamond && !(vIndex % 2) && vIndex !== 0) ?
                            <View
                                style={{
                                    backgroundColor: tinycolor(hueRects[0]).toHexString(),
                                    height: 22,
                                    marginBottom: -8,
                                    marginLeft: -3,
                                    marginTop: -4,
                                    width: margin + 2,
                                }}
                            /> : null
                        }
                    </View>
                );
            }));
    }

    render() {
        const {
            pickerSize
        } = this.state;
        const {
            diamond,
            textSaturation,
            style,
        } = this.props;
        const color = this._getColor();
        const {
            // h,
            s,
            // v
        } = color;

        return (
            <View style={style}>
                <View onLayout={this._onLayout} style={styles.pickerContainer}>
                    { pickerSize === null ? null :
                    <View>
                        {diamond ?
                            <View
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    marginBottom: -17,
                                    marginLeft: -3,
                                    height: 21,
                                    width: 21 * this.rects[0].length - 3,
                                }}
                            /> : null
                        }

                        {this.renderPalette()}

                        {diamond ?
                            <View
                                style={{
                                    backgroundColor: '#000000',
                                    marginTop: -4,
                                    marginLeft: -3,
                                    height: 11,
                                    width: 21 * this.rects[0].length - 3,
                                }}
                            /> : null
                        }
                    </View>
                    }
                </View>
                { this.props.hideSliders === true ? null :
                <View style={{flexDirection: 'row', marginVertical: 10, alignItems: 'center'}}>
                    <Text style={styles.paramText}>
                        {textSaturation}
                    </Text>
                    <Slider
                        style={{flex: 1}}
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        minimumTrackTintColor="#ff8800"
                        minimumValue={0}
                        maximumValue={1}
                        value={s}
                        step={0.01}
                        onSlidingComplete={this._onSlidingComplete}/>
                </View>
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    pickerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    paramText: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 14,
    },
});

export default RectangleColorPicker;
