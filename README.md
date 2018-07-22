## 腾讯地图 React 实现

### 使用案例

[Demo](https://github.com/lichenbuliren/qq-map-react)

## 支持组件列表

- QMap 根组件
- Marker 标记组件
- MarkerList 标记列表
- Polygon 多边形
- Circle 圆形
- Heatmap 热力图
- Info 提示层
- Polyline 折线

## 基本用法

在页面模板层，引入基础地图库

1. 引入 QQ 地图库

  ``` html
  <script src="//map.qq.com/api/js?v=2.exp&key=[开发者个人密钥]"></script>
  ```

  接入指引：[传送门](http://lbs.qq.com/javascript_v2/guide-base.html)

2. 如果要使用热力图组件，需要而外引入热力图库

   ``` html
   <script src="http://open.map.qq.com/apifiles/plugins/heatmap/heatmap.min.js"></script>  
   ```

### QMap 地图组件

支持的 `options` ，除了地图官方默认支持的属性 [MapOptions](http://lbs.qq.com/javascript_v2/doc/mapoptions.html) 之外，额外支持

- ``` center: { lat: number, lng: number }``` 地图中心点，经纬度规格为腾讯地图经纬度规格

``` jsx
<QMap
  center={center}
  style={{ height: '800px' }}
  zoom={zoom}
  events={{
   idle: map => this.handleMapIdle(map)
  }}
></QMap>
```

### Marker 标记组件

``` react
<Marker
  position={{lat: xxx, lng: xxx}}
  draggable={true}
  visible
  // 标记提示文案
  decoration="10"
  animation={config.ANIMATION_DROP}
  events={{
      click: this.handleMarkerClick
  }}
/>
```

### MarkerList 标记列表

``` react
<MarkerList
  showDecoration
  animation={config.ANIMATION_DROP}
  data={heatData.slice(0, 10)}
  events={{
    click: this.handleMarkerClick
  }} visible={true}
/>
```

### Info 提示弹层组件

``` react
<Info
  content={content}
  visible={showInfo}
  position={infoPosition}
  events={{
    closeclick: this.handleInfoClose
  }}
/>
```

### Polygon 多边形

``` react
<Polygon
  fillColor={fillColor}
  points={polygonPoints}
  strokeDashStyle={strokeDashStyle}
  editable
  visible
  draggable
  events={{
    adjustNode: e => this.handlePolygonChange(e),
    removeNode: e => this.handlePolygonChange(e),
    insertNode: e => this.handlePolygonChange(e)
  }}
/>
```

### Circle 圆形

``` react
<Circle
  center={center}
  radius={radius}
  strokeColor="#666"
  strokeDashStyle="dash"
  strokeWeight={2}
  events={{
    radius_changed: (circle, e) => this.handleRadiusChange(radius, circle, e)
  }}
/>
```

### Heatmap 热力图

``` react
<HeatMap heatData={heatMapData} options={heatMapOptions} />
```

### 自定义控件

``` react
import React from 'react'
import { ControlPosition, Control } from 'qmap'

export default class CustomControl extends Control {
  static defaultProps = {
    position: ControlPosition.TOP_CENTER,
    style: {},
    onEdit: () => {},
    onChoose: () => {}
  }

  render () {
    const { style, onEdit, onChoose } = this.props
    return (
      <div ref={node => (this.controlNode = node)} style={style}>
        <div className="tools">
          <button className="tc-15-btn weak" onClick={onEdit}><i className="icon-pen" />编辑</button>
          <button className="tc-15-btn weak selected" onClick={onChoose}><i className="icon-pointer" />选择</button>
        </div>
      </div>
    )
  }
}

```



### 参考资料

- [react-bmap 百度地图 React 实现方式](https://github.com/huiyan-fe/react-bmap)
- [腾讯地图 API](http://lbs.qq.com/javascript_v2/index.html)

## TODOS

- 网格热力图实现
- 其他基础地图组件实现