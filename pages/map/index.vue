<template>
  <div class="app">
    <div
      id="CSCMap"
      @mousemove="getMousePositionHandler"
      @click.stop="mapClickHandler"
    >
      <!-- <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.643521886401!2d121.56988721537932!3d25.080068742596296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x140dd0e0ae7a4407%3A0xb1faf1f46c633310!2z5bSn5pet6LOH6KiK6IKh5Lu95pyJ6ZmQ5YWs5Y-4!5e0!3m2!1szh-TW!2stw!4v1615512693367!5m2!1szh-TW!2stw"
        width="100%"
        height="100%"
        style="border: 0;"
        allowfullscreen=""
        loading="lazy"
      /> -->
    </div>

    <!-- 右下角的坐標資訊 -->
    <div v-if="screenWidth > 1023" class="coordinates">
      <!-- <div>滑鼠相對於地圖的 X 坐標：{{ mousePosition.x }}</div>
      <div>滑鼠相對於地圖的 Y 坐標：{{ mousePosition.y }}</div> -->
      <div class="co_cube">
        方格座標({{ coordinatesCube.x }}, {{ coordinatesCube.y }})
      </div>
      <div class="co_cubeno">
        方格圖號: {{ CubeNo }}
      </div>
      <div class="co_TWD">
        TWD97({{ coordinatesTwd.x }},{{ coordinatesTwd.y }})
      </div>
    </div>

    <!-- 行動版幾何繪圖的準心 -->
    <div v-if="geometryMeasurer.aimpoint === true" class="aimpoint" />

    <!-- ↓↓ 在地圖API裡面需要用到的DOM -->
    <div
      v-if="screenWidth > 1023"
      :style="'width: 365px; position: absolute; top: 100px; right: 100px;'"
    >
      <div class="building__item theme-in-map">
        <div class="building__title has-icon icon-type-yu">
          第三冷主變電站
        </div>
        <div class="building__body">
          <div class="building__content">
            <p class="has-icon icon-building">
              <strong>各棟名稱</strong>第三冷主變電站123
            </p>
            <p class="has-icon icon-people">
              <strong>用地申請單位/人員</strong>W51/劉小華
            </p>
            <p class="has-icon icon-license">
              <strong>用地登錄時間</strong>2019-11-26 18:00:36
            </p>
          </div>
          <a href="javascript:;" title="看詳細" class="read-more-btn">看詳細</a>
        </div>
        <div class="building__tag-group">
          <span class="building__tag icon-error">房屋稅籍</span><span class="building__tag icon-checked">工廠登記</span><span class="building__tag icon-checked">優惠減免</span><span class="building__tag icon-checked">保存登記</span>
        </div>
      </div>
    </div>

    <!-- 在 .building__item 添加 is-open 這個 class，選單項目就會展開 -->
    <div
      v-if="screenWidth > 1023"
      :style="'width: 365px; position: absolute; top: 250px; right: 100px;'"
    >
      <div class="infowindow">
        <div class="infowindow__title">
          建物列表
        </div>
        <div class="infowindow__content theme-scrollbar">
          <div class="building__item theme-in-map">
            <div class="building__title has-icon icon-type-yu">
              第三冷主變電站
            </div>
            <div class="building__article">
              <div class="building__body">
                <div class="building__content">
                  <p class="has-icon icon-building">
                    <strong>各棟名稱</strong>第三冷主變電站123
                  </p>
                  <p class="has-icon icon-people">
                    <strong>用地申請單位/人員</strong>W51/劉小華
                  </p>
                  <p class="has-icon icon-license">
                    <strong>用地登錄時間</strong>2019-11-26 18:00:36
                  </p>
                </div>
                <a href="javascript:;" title="看詳細" class="read-more-btn">看詳細</a>
              </div>
              <div class="building__tag-group">
                <span class="building__tag icon-error">房屋稅籍</span><span class="building__tag icon-checked">工廠登記</span><span class="building__tag icon-checked">優惠減免</span><span class="building__tag icon-checked">保存登記</span>
              </div>
            </div>
          </div>
          <div class="building__item theme-in-map">
            <div class="building__title has-icon icon-type-jiun">
              第三冷主變電站
            </div>
            <div class="building__article">
              <div class="building__body">
                <div class="building__content">
                  <p class="has-icon icon-building">
                    <strong>各棟名稱</strong>第三冷主變電站123
                  </p>
                  <p class="has-icon icon-people">
                    <strong>用地申請單位/人員</strong>W51/劉小華
                  </p>
                  <p class="has-icon icon-license">
                    <strong>用地登錄時間</strong>2019-11-26 18:00:36
                  </p>
                </div>
                <a href="javascript:;" title="看詳細" class="read-more-btn">看詳細</a>
              </div>
              <div class="building__tag-group">
                <span class="building__tag icon-error">房屋稅籍</span><span class="building__tag icon-checked">工廠登記</span><span class="building__tag icon-checked">優惠減免</span><span class="building__tag icon-checked">保存登記</span>
              </div>
            </div>
          </div>
          <div class="building__item theme-in-map">
            <div class="building__title has-icon icon-type-shin">
              第三冷主變電站
            </div>
            <div class="building__article">
              <div class="building__body">
                <div class="building__content">
                  <p class="has-icon icon-building">
                    <strong>各棟名稱</strong>第三冷主變電站123
                  </p>
                  <p class="has-icon icon-people">
                    <strong>用地申請單位/人員</strong>W51/劉小華
                  </p>
                  <p class="has-icon icon-license">
                    <strong>用地登錄時間</strong>2019-11-26 18:00:36
                  </p>
                </div>
                <a href="javascript:;" title="看詳細" class="read-more-btn">看詳細</a>
              </div>
              <div class="building__tag-group">
                <span class="building__tag icon-error">房屋稅籍</span><span class="building__tag icon-checked">工廠登記</span><span class="building__tag icon-checked">優惠減免</span><span class="building__tag icon-checked">保存登記</span>
              </div>
            </div>
          </div>
          <div class="building__item theme-in-map">
            <div class="building__title has-icon icon-type-yu">
              第三冷主變電站
            </div>
            <div class="building__article">
              <div class="building__body">
                <div class="building__content">
                  <p class="has-icon icon-building">
                    <strong>各棟名稱</strong>第三冷主變電站123
                  </p>
                  <p class="has-icon icon-people">
                    <strong>用地申請單位/人員</strong>W51/劉小華
                  </p>
                  <p class="has-icon icon-license">
                    <strong>用地登錄時間</strong>2019-11-26 18:00:36
                  </p>
                </div>
                <a href="javascript:;" title="看詳細" class="read-more-btn">看詳細</a>
              </div>
              <div class="building__tag-group">
                <span class="building__tag icon-error">房屋稅籍</span><span class="building__tag icon-checked">工廠登記</span><span class="building__tag icon-checked">優惠減免</span><span class="building__tag icon-checked">保存登記</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ↑↑ 在地圖API裡面需要用到的DOM -->

    <!-- 左側的搜尋選單 -->
    <QueryWindow-component
      v-if="Object.keys(structureCondition).length > 0"
      ref="queryWindow"
      :open="queryWindowOpen"
      :condition="structureCondition"
      :result-type="searchResult.types"
      @control="payload => queryWindowOpen = payload"
      @search="searchHandler"
      @clearResult="clearSearchResultHandler"
    >
      <QueryWindowContainer-component
        v-if="screenWidth > 1023 && (searchResult.types === 'structure' || searchResult.types === 'lattice')"
        :result-type="searchResult.types"
        :result-number="searchResult.list.structure.length"
      >
        <!-- 建物搜尋結果 -->
        <BuildingList-component
          v-if="searchResult.types === 'structure'"
          :items-list="searchResult.list.structure"
          :current-id="searchResult.currentBuilding"
          @click-block="focusBuildingHandler"
          @click-detail="payload => REDIRECT_DETAIL(payload.detailUrl)"
        />
        <!-- 方格搜尋結果 -->
        <LatticeListTable-component
          v-if="searchResult.types === 'lattice'"
          :result-list="searchResult.list.lattice"
          @delete="deleteLatticeHandler"
          @updateOpacity="updateLatticeOpacityHandler"
          @setPosition="setLatticePositionHandler"
        />
      </QueryWindowContainer-component>
    </QueryWindow-component>

    <!-- 右側的功能選單 -->
    <Feature-component
      :current="activeWindow"
      @select="payload => activeWindow = payload"
      @setPositionAlert="ctrlPositionAlert"
      @hideTagBar="hideTagBarCtrl"
      @hideCluster="hideClusterHandler"
    />

    <!-- ERP 視窗（建物搜尋結果） -->
    <transition
      name="popup-slide"
      mode="out-in"
    >
      <ErpContentBox-component
        v-if="screenWidth < 1024 && searchResult.types === 'structure'"
        :items-list="searchResult.list.structure"
        :current-id="searchResult.currentBuilding"
        @close="clearSearchResultAndCondition"
        @map-focus="focusBuildingHandler"
      />
    </transition>

    <!-- 方格視窗（方格搜尋結果） -->
    <transition
      name="popup-slide"
      mode="out-in"
    >
      <PopupBox-component
        v-if="screenWidth < 1024 && searchResult.types === 'lattice'"
        :name="'方格圖層'"
        :icon-name="'icon-grid'"
        :close-btn-text="'清除全部'"
        @close="clearSearchResultAndCondition"
      >
        <LatticeListTable-component
          :result-list="searchResult.list.lattice"
          @delete="deleteLatticeHandler"
          @updateOpacity="updateLatticeOpacityHandler"
          @setPosition="setLatticePositionHandler"
        />
      </PopupBox-component>
    </transition>

    <!-- 新增預定用地 -->
    <DragBox-component
      v-if="screenWidth > 1023"
      v-show="ctrlDragBoxVisible('addLandWindow')"
      :key="'addLandWindow'"
      :name="'新增預定用地'"
      :icon-name="'icon-add-land'"
      @close="activeWindow = ''"
    >
      <template #content>
        <GeometriesTabs-component
          :current="geometryOptions.current"
          :types-list="geometryTypesProvider(['rectangleLand', 'polygonLand', 'circleLand'])"
          :graph-list="geometryGraphProvider(['rectangleLand', 'polygonLand', 'circleLand'])"
          @selectType="payload => geometryOptions.current = payload"
          @deleteGraph="deleteGeometryItemHandler"
          @deleteAllGraph="deleteAllGeometryItemHandler"
        />
      </template>
    </DragBox-component>

    <!-- 坐標查詢 -->
    <DragBox-component
      v-if="screenWidth > 1023"
      v-show="ctrlDragBoxVisible('setPositionWindow')"
      :key="'setPositionWindow'"
      :name="'坐標定位'"
      :icon-name="'icon-set-position'"
      @close="activeWindow = ''"
    >
      <template #content>
        <PositionNavtabs-component
          :options="positionOptions"
          @select="payload => positionOptions.current = payload"
          @update="updatePositionOptions"
          @submit="setPositionHandler"
        />
      </template>
    </DragBox-component>

    <transition
      name="popup-slide"
      mode="out-in"
    >
      <PopupBox-component
        v-if="ctrlPopupBoxVisible('setPositionWindow')"
        :key="'setPositionopup'"
        :name="'坐標定位'"
        :icon-name="'icon-set-position'"
        @close="activeWindow = ''"
        @showBar="showTagBarCtrl"
      >
        <PositionNavtabs-component
          :options="positionOptions"
          @select="payload => positionOptions.current = payload"
          @update="updatePositionOptions"
          @submit="setPositionHandler"
        />
      </PopupBox-component>
    </transition>

    <!-- 測量距離/面積 -->
    <DragBox-component
      v-if="screenWidth > 1023"
      v-show="ctrlDragBoxVisible('measureWindow')"
      :key="'measureWindow'"
      :name="'測量距離/面積'"
      :icon-name="'icon-measure'"
      @close="activeWindow = ''"
    >
      <template #content>
        <GeometriesTabs-component
          :current="geometryOptions.current"
          :types-list="geometryTypesProvider(['line', 'rect', 'poly', 'circle'])"
          :graph-list="geometryGraphProvider(['line', 'rect', 'poly', 'circle'])"
          @selectType="payload => geometryOptions.current = payload"
          @deleteGraph="deleteGeometryItemHandler"
          @deleteAllGraph="deleteAllGeometryItemHandler"
        />
      </template>
    </DragBox-component>

    <transition
      name="popup-slide"
      mode="out-in"
    >
      <PopupBox-component
        v-if="ctrlPopupBoxVisible('measureWindow')"
        :key="'measurePopup'"
        :name="'測量距離/面積'"
        :icon-name="'icon-measure'"
        @close="activeWindow = ''"
        @showBar="showTagBarCtrl"
      >
        <div class="navtabs">
          <div class="navtabs__header">
            <a
              v-for="typeItem of geometryMeasurer.typeList"
              :key="typeItem.id"
              href="javascript:;"
              class="navtabs__btn"
              :class="{ 'current': geometryMeasurer.current === typeItem.id }"
              :title="typeItem.name"
              @click.stop="geometryMeasurer.current = typeItem.id"
              @mousedown.prevent
            >
              <span>{{ typeItem.name }}</span>
            </a>
          </div>
          <div class="navtabs__body">
            <div class="navtabs__content">
              <div class="notice-tips">
                <p>{{ geometryMeasurerDiscription }}</p>
              </div>
              <div
                v-if="geometryMeasurer.current === 'point'"
                class="row is-flex-center"
              >
                <a href="javascript:;" class="links-btn" title="完成">完成</a>
                <a href="javascript:;" class="links-btn" title="複製坐標">複製坐標</a>
                <a href="javascript:;" class="links-btn color-light-blue" title="匯入方格圖">匯入方格圖</a>
                <a href="javascript:;" class="links-btn color-red" title="重新繪製">重新繪製</a>
              </div>
              <div
                v-if="geometryMeasurer.current === 'line'"
                class="row is-flex-center"
              >
                <a href="javascript:;" class="circle-btn icon-comeback" title="返回">
                  <span>返回</span>
                </a>
                <a href="javascript:;" class="links-btn" title="完成">完成</a>
                <a href="javascript:;" class="circle-btn icon-increase" title="新增">
                  <span>新增</span>
                </a>
                <a href="javascript:;" class="links-btn color-red" title="重新繪製">重新繪製</a>
              </div>
              <div
                v-if="geometryMeasurer.current === 'surface'"
                class="row is-flex-center"
              >
                <a href="javascript:;" class="circle-btn icon-comeback" title="返回">
                  <span>返回</span>
                </a>
                <a href="javascript:;" class="links-btn" title="完成">完成</a>
                <a href="javascript:;" class="circle-btn icon-increase" title="新增">
                  <span>新增</span>
                </a>
                <a href="javascript:;" class="links-btn color-red" title="重新繪製">重新繪製</a>
              </div>
            </div>
          </div>
        </div>
      </PopupBox-component>
    </transition>

    <!-- 圖層切換 -->
    <DragBox-component
      v-if="screenWidth > 1023"
      v-show="ctrlDragBoxVisible('switchLayersWindow')"
      :key="'switchLayersWindow'"
      @close="activeWindow = ''"
    >
      <template #header>
        <div class="navtabs__header theme-dark-mode">
          <a
            href="javascript:;"
            class="navtabs__btn theme-dark-mode"
            :class="{ 'current': layerOptions.current === 'local' }"
            title="我的圖層"
            @click.stop="layerOptions.current = 'local'"
            @mousedown.prevent
          >
            <span>我的圖層</span>
          </a>
          <a
            href="javascript:;"
            class="navtabs__btn theme-dark-mode"
            :class="{ 'current': layerOptions.current === 'addition' }"
            title="加入圖層"
            @click.stop="layerOptions.current = 'addition'"
            @mousedown.prevent
          >
            <span>加入圖層</span>
          </a>
        </div>
      </template>
      <template #content>
        <div class="navtabs__content theme-dark-mode">
          <div class="layersTable__wrapper theme-scrollbar">
            <table class="layersTable">
              <thead>
                <tr>
                  <th>圖層名稱</th>
                  <th>可見度</th>
                  <th>透明度</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="layerItem of switchLayerProvider(layerOptions.current)">
                  <tr
                    :key="layerItem.id"
                    :class="{ 'is-active': layerOptions.current === 'addition' && layerOptions.active === layerItem.id }"
                    @mouseenter="layerOptions.active = layerItem.id"
                    @mouseleave="layerOptions.active = ''"
                  >
                    <td>
                      <div class="layersTable__btn">
                        {{ layerItem.name }}
                      </div>
                    </td>
                    <td>
                      <ViewCheckbox
                        :id="layerItem.id"
                        :visible="layerItem.visible"
                        @change="layerItem.visible = $event"
                      />
                    </td>
                    <td>
                      <OpacityController
                        :id="layerItem.id"
                        :value="layerItem.opacity"
                        @update="updateLayerOpacities"
                      />
                    </td>
                  </tr>
                  <tr
                    v-if="layerOptions.current === 'addition'"
                    v-show="layerOptions.active === layerItem.id"
                    :key="`table-detail_${layerItem.id}`"
                    :class="{ 'is-active': layerOptions.current === 'addition' && layerOptions.active === layerItem.id }"
                    @mouseenter="layerOptions.active = layerItem.id"
                    @mouseleave="layerOptions.active = ''"
                  >
                    <td class="layersTable__detail" colspan="3">
                      <div class="btn-group is-flex-end">
                        <a
                          href="javascript:;"
                          class="btn color-light-blue size-small has-front-icon icon-location"
                          title="定位"
                          @click.stop="setLayerPositionHandler(layerItem.id)"
                          @mousedown.prevent
                        >
                          <span>定位</span>
                        </a>
                        <a
                          href="javascript:;"
                          class="btn color-light-blue size-small has-front-icon icon-delete"
                          title="移除"
                          @click.stop="deleteLayerHandler(layerItem.id)"
                          @mousedown.prevent
                        >
                          <span>移除</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-if="switchLayerProvider(layerOptions.current).length <= 0">
                  <td colspan="3" align="center">
                    <p class="notice-tips">
                      尚未新增圖層
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-if="layerOptions.current === 'addition'"
            class="row is-flex-end has-padding"
          >
            <a
              href="javascript:;"
              class="btn color-blue has-front-icon icon-add-layer size-small"
              title="新增圖層"
              @click.stop="addLayerHandler"
              @mousedown.prevent
            >
              <span>新增圖層</span>
            </a>
          </div>
        </div>
      </template>
    </DragBox-component>

    <transition
      name="popup-slide"
      mode="out-in"
    >
      <PopupBox-component
        v-if="ctrlPopupBoxVisible('switchLayersWindow')"
        :key="'switchLayersPopup'"
        :name="'圖層工具'"
        :icon-name="'icon-switch-layers'"
        @close="activeWindow = ''"
        @showBar="showTagBarCtrl"
      >
        <table class="layersTable">
          <thead style="display: none;">
            <tr>
              <th>圖層名稱</th>
              <th>可見度</th>
              <th>透明度</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="layerItem of switchLayerProvider('local')" :key="layerItem.id">
              <td>
                <div class="layersTable__btn">
                  {{ layerItem.name }}
                </div>
              </td>
              <td>
                <ViewCheckbox
                  :id="layerItem.id"
                  :visible="layerItem.visible"
                  @change="layerItem.visible = $event"
                />
              </td>
              <td>
                <OpacityController
                  :id="layerItem.id"
                  :value="layerItem.opacity"
                  @update="updateLayerOpacities"
                />
              </td>
            </tr>
            <tr v-if="switchLayerProvider('local').length <= 0">
              <td colspan="3" align="center">
                <p class="notice-tips">
                  尚未新增圖層
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </PopupBox-component>
    </transition>

    <!-- 我的位置視窗 -->
    <transition
      name="popup-slide"
      mode="out-in"
    >
      <PositionAlert-component
        v-if="positionAlert.isOpen === true"
        :reference="positionAlert.reference"
        @control="ctrlPositionAlert"
      />
    </transition>
  </div>
</template>

<script>
import QueryWindow from '~/components/QueryWindow';
import QueryWindowContainer from '~/components/QueryWindowContainer';
import Feature from '~/components/Feature';
import DragBox from '~/components/DragBox';
import PopupBox from '~/components/PopupBox';
import PositionAlert from '~/components/PositionAlert';
import PositionNavtabs from '~/components/PositionNavtabs';
import GeometriesTabs from '~/components/GeometriesTabs';
import LatticeListTable from '~/components/LatticeListTable';
import ErpContentBox from '~/components/ErpContentBox';
import BuildingList from '~/components/BuildingList';
import OpacityController from '~/components/tools/OpacityController';
import ViewCheckbox from '~/components/tools/ViewCheckbox';

export default {
  data () {
    return {
      // * 畫面左側的搜尋選單是否開啟
      queryWindowOpen: false,
      // * 目前所選取的功能視窗
      activeWindow: '',
      // * 我的位置視窗
      positionAlert: {
        // 是否開啟
        isOpen: false,
        // 計時器
        timer: null,
        // 坐標資訊
        reference: {
          latitude: 0,
          longitude: 0
        }
      },
      // * 坐標的控制欄
      positionOptions: {
        // 操作介面的頁籤
        current: 0,
        typeList: [
          { id: 0, name: '方格圖號' },
          { id: 1, name: '方格坐標' },
          { id: 2, name: 'TWD97' }
        ],
        // 類型（中鋼：true、冷三：false）
        searchTypeCsc: true,
        // 方格圖號
        gridNumber: '',
        // 方格坐標
        gridPosition: {
          x: '',
          y: ''
        },
        // TWD97坐標
        twdPosition: {
          x: '',
          y: ''
        }
      },
      // * 圖層的控制欄
      layerOptions: {
        // 操作介面的頁籤（我的圖層：local、加入圖層：addition）
        current: 'local',
        // 目前 hover 到的圖層項目
        active: '',
        // 圖層資料列表
        layerList: []
      },
      // * 幾何繪圖的控制欄（電腦版）
      geometryOptions: {
        // 目前選取的圖形類別
        current: '',
        // 圖形類別
        typeList: [
          {
            id: 'rectangleLand',
            name: '矩形預定地',
            graphName: '預定地',
            description: '在地圖上選定兩個點，拉出矩形建地點擊兩下完成。'
          },
          {
            id: 'polygonLand',
            name: '多邊形預定地',
            graphName: '預定地',
            description: '在地圖上選定至少三個點，拉出多邊形建地，點擊兩下完成。'
          },
          {
            id: 'circleLand',
            name: '圓形預定地',
            graphName: '預定地',
            description: '在地圖上選定圓心，滑鼠拖曳不放，即可拉出圓形建地。'
          },
          {
            id: 'line',
            name: '線段測量',
            graphName: '線段',
            description: '請以滑鼠點擊地圖至少兩點，以測量距離，滑鼠雙擊即可結束。'
          },
          {
            id: 'rect',
            name: '矩形測量',
            graphName: '矩形',
            description: '請以滑鼠點擊地圖後拖曳，放開滑鼠及完成測量矩形面積。'
          },
          {
            id: 'poly',
            name: '多邊形測量',
            graphName: '多邊形',
            description: '請以滑鼠點擊地圖至少三點，完成之後點擊地圖兩下，以測量多邊形面積。'
          },
          {
            id: 'circle',
            name: '圓形測量',
            graphName: '圓形',
            description: '請以滑鼠選定地圖上的圓心後拖曳，放開滑鼠即完成測量圓形面積。'
          }
        ],
        // 圖形資料列表
        graphList: [],
        // 項目計數器（取名用）
        amountCounter: {
          lands: 0,
          line: 0,
          rect: 0,
          poly: 0,
          circle: 0
        }
      },
      // * 幾何繪圖的控制欄（行動版）
      geometryMeasurer: {
        // 目前選取的圖形類別
        current: 'point',
        // 圖形類別
        typeList: [
          {
            id: 'point',
            name: '點測量',
            discription: '手指放大縮小移動坐標位置'
          },
          {
            id: 'line',
            name: '線測量',
            discription: '手指移動地圖新增節點，按下確定結束測量'
          },
          {
            id: 'surface',
            name: '面測量',
            discription: '手指移動地圖新增節點，按下確定結束測量'
          }
        ],
        // 準心
        aimpoint: false
      },
      // * 搜尋結果類型
      searchResult: {
        // 搜尋結果類型（建物：structure、方格：lattice）
        types: '',
        // 搜尋結果列表
        list: {
          structure: [],
          lattice: []
        },
        // 目前選取的建物
        currentBuilding: ''
      },
      // * 建物搜尋條件選項
      structureCondition: {},
      // * 相對於地圖頁面滑鼠座標
      mousePosition: {
        x: 0,
        y: 0
      },
      // * 方格座標
      coordinatesCube: {
        x: '',
        y: ''
      },
      // * 方格圖號
      CubeNo: '',
      // * TWD座標
      coordinatesTwd: {
        x: '',
        y: ''
      },
      gisMap: '',
      markerVisible: true
    };
  },
  components: {
    'QueryWindow-component': QueryWindow,
    'QueryWindowContainer-component': QueryWindowContainer,
    'Feature-component': Feature,
    'DragBox-component': DragBox,
    'PopupBox-component': PopupBox,
    'PositionAlert-component': PositionAlert,
    'GeometriesTabs-component': GeometriesTabs,
    'LatticeListTable-component': LatticeListTable,
    'PositionNavtabs-component': PositionNavtabs,
    'ErpContentBox-component': ErpContentBox,
    'BuildingList-component': BuildingList,
    OpacityController,
    ViewCheckbox
  },
  mounted () {
    this.getDefaultData();
  },
  beforeDestroy () {
    clearTimeout(this.positionAlert.timer);
  },
  methods: {
    // ? 載入預設需要載入的資料
    getDefaultData () {
      // 開啟 Loading 視窗
      this.$store.commit('CTRL_LOADING_MASK', true);

      // ? 用 setTimeout 模擬 ajax 完成的狀態給人看
      setTimeout(() => {
        // ! 取得建物搜尋條件，這邊應該要用 ajax 抓資料回來
        this.structureCondition = require('~/static/_resources/structureCondition.json');

        // ! 取得預設圖層，這邊應該要用 ajax 抓資料回來
        const _layers = require('~/static/_resources/defaultLayerList.json');
        this.layerOptions.layerList = [..._layers.data];

        // 關閉 Loading 視窗與開啟側邊選單
        this.$store.commit('CTRL_LOADING_MASK', false);
        this.queryWindowOpen = true;

        // * 如果是從首頁點擊「坐標查詢」來這一頁，預設就開啟「坐標查詢」
        // if (this.$route.params.preload === 'openSetPosition') {
        //   this.activeWindow = 'setPositionWindow';
        // }
        const searchURL = window.location.search;
        const targetPageName = searchURL.split('=')[1];
        if (targetPageName === 'openSetPosition') {
          this.activeWindow = 'setPositionWindow';
          this.$store.commit('SET_MOBILE_SELECT', true);
        }

        // * 引入地圖api
        const map = new CSC.GISOnlineMap(document.getElementById('CSCMap'), { autoLoad: true });
        this.gisMap = map;
        // 滑鼠坐標
        CSC.GISEvent.addListener(map, 'coordinate', (o) => {
          this.coordinatesCube.x = o.CSC.x.toFixed(2);
          this.coordinatesCube.y = o.CSC.y.toFixed(2);
          this.CubeNo = o.GridNO;
          this.coordinatesTwd.x = o.TWD97.x.toFixed(2);
          this.coordinatesTwd.y = o.TWD97.y.toFixed(2);
          console.log(o);
        });

        CSC.GISEvent.addListener(map, 'markerclick', function (e) {
          console.log(e.markers.length);
        });
        // 設定球標顯示
        // map.setupMarker({ visible: true });
        // 設定圖層顯示、透明度
        map.setupLayer({ fid: 10, visible: false, opacity: 100 });
      }, 1000);
    },
    // * 控制視窗顯示
    ctrlDragBoxVisible (payload) {
      // @DragBox：電腦版可以在畫面上任意移動的 component
      return this.screenWidth > 1023 && this.activeWindow === payload;
    },
    ctrlPopupBoxVisible (payload) {
      // @PopupBox：行動版下方的選單 component
      return this.screenWidth < 1024 && this.activeWindow === payload;
    },
    // * @坐標查詢：更新使用者輸入的參數
    updatePositionOptions (payload) {
      /*
        坐標查詢視窗（@PositionNavtabs）的資料更新時
        同步更新至父層的 data，使用 @emit update
       */
      Object.keys(payload).forEach((key) => {
        this.positionOptions[key] = payload[key];
      });
    },
    // * @坐標查詢：控制地圖API，移動至對應的坐標查詢
    setPositionHandler () {
      console.warn('【坐標查詢】根據輸入的坐標，移動至對應的坐標查詢');
    },
    // * @我的位置：控制視窗開啟/關閉
    ctrlPositionAlert (payload) {
      if (payload === true) {
        if (this.positionAlert.timer === null) {
          // ! 這邊需要抓取坐標資訊
          if (window.navigator.geolocation) {
            // 取得瀏覽器坐標資訊
            window.navigator.geolocation.getCurrentPosition((data) => {
              this.positionAlert.reference.latitude = data.coords.latitude;
              this.positionAlert.reference.longitude = data.coords.longitude;

              this.CONSOLE('【我的位置】根據瀏覽器位置調整坐標資訊');
              this.positionAlert.isOpen = true;
              this.positionAlert.timer = setTimeout(() => {
                this.closePositionAlert();
              }, 3000);
            }, (err) => {
              console.log(err);

              this.$swal({
                icon: 'error',
                text: '坐標資訊取得失敗',
                confirmButtonText: '確定',
                showCloseButton: true
              });
            });
          } else {
            this.$swal({
              icon: 'error',
              text: '您的瀏覽器的不支援取得坐標資訊',
              confirmButtonText: '確定',
              showCloseButton: true
            });
          }
        }
      } else {
        clearTimeout(this.positionAlert.timer);
        this.closePositionAlert();
      }
    },
    // * @我的位置：視窗關閉，並清除坐標資訊
    closePositionAlert () {
      this.positionAlert.isOpen = false;
      this.positionAlert.timer = null;
      this.positionAlert.reference.latitude = 0;
      this.positionAlert.reference.longitude = 0;
    },
    // * @圖層切換調整：修改透明度數值
    updateLayerOpacities (id, value) {
      /*
        當透明度控制器（@OpacityController）的資料更新時
        同步更新對應項目的資料
       */
      const { layerList } = this.layerOptions;
      const index = layerList.findIndex(item => item.id === id);
      layerList[index].opacity = value;
    },
    // * @圖層切換調整：刪除圖層
    deleteLayerHandler (id) {
      const { layerList } = this.layerOptions;
      const index = layerList.findIndex(item => item.id === id);
      layerList.splice(index, 1);
    },
    // * @圖層切換調整：圖層定位
    setLayerPositionHandler (id) {
      // 根據 id 去 this.layerOptions.layerList 取得對應的資料更新地圖
      this.CONSOLE('【圖層調整】根據所選的圖層項目調整地圖定位');
    },
    // * @圖層切換調整：資料篩選
    switchLayerProvider (currentName) {
      /*
        所有圖層項目都是放在 this.layerOptions.layerList
        透過 currentName（我的圖層：local、加入圖層：addition）來篩選出對應的資料
       */
      return this.layerOptions.layerList.filter((item) => {
        return item.type === currentName && item.enabled === true;
      });
    },
    // ? @圖層切換調整：新增圖層
    addLayerHandler () {
      // ! 新增圖層的功能是檔案上傳匯入的，這邊先做一個假的模擬
      // ! 要注意每個圖層要有獨立的 ID，若 API 沒提供就要自己生

      this.CONSOLE('【圖層調整】這邊需要讓使用者上傳圖層資料');

      const _layer = {
        id: `layer_${this.GET_RESOURCE_ID()}`,
        name: '111',
        type: 'addition',
        visible: false,
        opacity: 10,
        enabled: true
      };

      this.layerOptions.layerList.push(_layer);
    },
    // * @幾何圖形：幾何圖形類別
    geometryTypesProvider (nameList) {
      return this.geometryOptions.typeList.filter(item => nameList.includes(item.id));
    },
    // * @幾何圖形：篩選幾何圖形資料
    geometryGraphProvider (nameList) {
      return this.geometryOptions.graphList.filter(item => nameList.includes(item.type));
    },
    // * @幾何圖形：刪除幾何圖形資料
    deleteGeometryItemHandler (id) {
      const { graphList } = this.geometryOptions;
      const index = graphList.findIndex(item => item.id === id);
      graphList.splice(index, 1);
    },
    // * @幾何圖形：刪除所有幾何圖形資料
    deleteAllGeometryItemHandler (nameList) {
      const { graphList } = this.geometryOptions;
      const result = graphList.filter(item => !nameList.includes(item.type));
      this.geometryOptions.graphList = result;
    },
    // * @幾何圖形：新增幾何圖形資料
    createGeometryItemHandler () {
      const { current, graphList, amountCounter } = this.geometryOptions;
      if (current === '') { return false; }

      const category = !['line', 'rect', 'poly', 'circle'].includes(current) ? 'lands' : current;

      const result = {
        id: `geometry_${this.GET_RESOURCE_ID()}`,
        name: this.geometryNameProvider(category),
        type: current,
        coordinate: [],
        detail: ['詳細資訊123'],
        controlBar: false
      };

      amountCounter[category] += 1;
      graphList.push(result);
    },
    // * @幾何圖形：取得幾何圖形圖層名稱
    geometryNameProvider (category) {
      const { current, typeList, amountCounter } = this.geometryOptions;
      const name = typeList.filter(item => item.id === current)[0].graphName;
      const amount = amountCounter[category];
      return `${name}${amount + 1}`;
    },
    // ? @搜尋：建物搜尋與匯入方格圖
    searchHandler (payload) {
      this.$store.commit('CTRL_LOADING_MASK', true);
      this.clearSearchResultHandler();

      // ! 先用 setTimeout 做一個模擬 ajax 的樣子給人看
      setTimeout(() => {
        const MODE_TYPE = payload.modeType;

        // ! 這邊要用 call api 抓資料
        const result = require(`~/static/_resources/${MODE_TYPE}Result.json`);

        this.searchResult.types = MODE_TYPE;
        this.searchResult.list[MODE_TYPE] = [...result.data];
        // this.activeWindow = '';  //0517修改 讓桌機版建物搜尋後 圖層工具仍開啟

        // ? 看 MODE_TYPE 是建物還是方格，控制地圖API
        if (MODE_TYPE === 'structure') {
          this.CONSOLE('【建物搜尋】地圖移動到搜尋結果的全範圍');
        } else if (MODE_TYPE === 'lattice') {
          this.CONSOLE('【方格圖搜尋】地圖移動到搜尋結果的全範圍');
        }

        this.$store.commit('CTRL_LOADING_MASK', false);
      }, 1000);
    },
    // * @搜尋：清除所有搜尋結果
    clearSearchResultHandler () {
      this.searchResult.types = '';
      this.searchResult.list.structure = [];
      this.searchResult.list.lattice = [];
      this.searchResult.currentBuilding = '';
    },
    // * @搜尋：清除所有搜尋結果與輸入欄位
    clearSearchResultAndCondition () {
      this.clearSearchResultHandler();

      const _queryWindow = this.$refs.queryWindow;
      _queryWindow.clearAllHandler();
    },
    // * 選取建物項目，地圖移動至對應坐標
    focusBuildingHandler (payload) {
      this.searchResult.currentBuilding = payload.id;
      this.CONSOLE('【建物搜尋】地圖移動到所選取的建物坐標位置');
    },
    // * @方格圖：刪除方格圖層
    deleteLatticeHandler (id) {
      const { lattice } = this.searchResult.list;
      const index = lattice.findIndex(item => item.id === id);
      lattice.splice(index, 1);

      if (lattice.length < 1) {
        this.clearSearchResultHandler();
      }
    },
    // * @方格圖：更新方格圖層透明度
    updateLatticeOpacityHandler (id, value) {
      const { lattice } = this.searchResult.list;
      const index = lattice.findIndex(item => item.id === id);
      lattice[index].opacity = value;
    },
    // * @方格圖：方格圖層定位
    setLatticePositionHandler (id) {
      this.CONSOLE('【方格圖搜尋】根據方格圖的id，移動至對應的坐標定位');
    },
    // 取得滑鼠座標位置
    getMousePositionHandler (e) {
      this.mousePosition.x = e.offsetX;
      this.mousePosition.y = e.offsetY;
    },
    // 點擊地圖區塊
    mapClickHandler () {
      if (this.screenWidth > 1023) { return; }
      if (this.activeWindow !== '') { return; }
      if (this.searchResult.types !== '') { return; }
      if (this.positionAlert.isOpen === true) { return; }
      if (this.$store.state.menuOpen === true) { return; }

      const result = !this.$store.state.triggerHidden;
      this.$store.commit('SET_TRIGGER_HIDDEN', result);
    },
    // 手機版點擊右側地圖工具列的 圖層工具、坐標定位、測量距離/面積時 上方TAG列和右側工具列會滑動消失
    hideTagBarCtrl () {
      if (this.screenWidth < 1024) {
        this.$store.commit('SET_MOBILE_SELECT', true);
      }
    },
    // 手機版按"X"關閉PopupBox時 上方TAG列和右側工具列會恢復顯示
    showTagBarCtrl () {
      this.$store.commit('SET_MOBILE_SELECT', false);
    },
    // * 隱藏建物球標
    hideClusterHandler () {
      this.gisMap.setupMarker({ visible: this.markerVisible = !this.markerVisible });
    }
    // getStructureCondition () {
    //   fetch('https://east.csc.com.tw/eas/mhb/rest/mhbe/BuildingList?_format=json&Keyword=&Status=&Type=', {
    //     method: 'GET',
    //     headers: new Headers({
    //       'Content-Type': 'application/json'
    //     })
    //   }).then((response) => {
    //     return response.json();
    //   }).then((data) => {
    //     console.log(data);
    //     data.
    //   }).catch((err) => {
    //     console.log('錯誤:', err);
    //   });
    // }
  },
  computed: {
    screenWidth () {
      return this.$store.state.screenWidth;
    },
    // * 行動版幾何繪圖控制欄的說明
    geometryMeasurerDiscription () {
      const { typeList, current } = this.geometryMeasurer;
      const result = typeList.filter(item => item.id === current);
      return result[0].discription;
    }
  },
  watch: {
    activeWindow (value) {
      if (value === '') {
        this.geometryOptions.current = '';
      }

      if (value === 'measureWindow' && this.screenWidth < 1024) {
        this.geometryMeasurer.aimpoint = true;
      } else {
        this.geometryMeasurer.aimpoint = false;
      }
    },
    // * 這邊用 watch 監聽資料的變化，也可以改用別種方式來做
    'geometryOptions.current' (value) {
      if (value !== '') {
        this.CONSOLE(`【幾何圖形】呼叫 createGeometryItemHandler() 就可以新增 ${value} 圖形`);
      }
    },
    'layerOptions.layerList': {
      handler (value) {
        this.CONSOLE('【圖層調整】根據資料的變化調整地圖圖層');
      },
      deep: true
    },
    'searchResult.list.lattice': {
      handler (current, prev) {
        this.CONSOLE('【方格圖搜尋】根據資料的變化調整方格圖地圖');
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

.app {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: $color-black;
  z-index: 0;
}

#CSCMap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;

  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
  }
}

// * 手機版測量工具的準心

.aimpoint {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url('~/assets/img/aimpoint.png') no-repeat center/55%;
  z-index: 4000;
  pointer-events: none;
}

// * 右下角的目前坐標資訊

.coordinates {
  width: 300px;
  height: 60px;
  padding: 7px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #707070;
  background-color: $color-white;
  z-index: 4000;
}

.co_cube {
  position: absolute;
  top: 8px;
  left: 15px;
  font-size: 12px;
}

.co_cubeno {
  position: absolute;
  top: 8px;
  left: 180px;
  font-size: 12px;
}

.co_TWD {
  position: absolute;
  top: 30px;
  left: 15px;
  font-size: 12px;
}

// * 圖層工具的表格

.layersTable {
  th,
  td {
    width: 115px;

    &:first-child {
      width: auto;
    }

    &:nth-child(2) {
      width: 75px;
    }
  }

  th {
    text-align: center;

    @include min-width(map-get($desktop, sm)) {
      padding-right: 7px;
      padding-left: 7px;
    }
  }

  td {
    @include min-width(map-get($desktop, sm)) {
      padding-right: 5px;
      padding-left: 5px;
    }
  }

  thead {
    @include max-width(map-get($tablet, lg)) {
      display: none;
    }
  }

  tbody {
    tr {
      border: 5px rgba($color-white, 0) solid;
      border-right-width: 10px;
      border-left-width: 10px;
    }
  }

  tr {
    &.is-active {
      background-color: $color-yellow;
    }
  }
}

.layersTable__btn {
  color: inherit;
}

.layersTable__row {
  display: table-row;
}

.layersTable__wrapper {
  width: 100%;
  max-height: 360px;
  overflow-x: hidden;
  overflow-y: auto;
}

@import '~/assets/scss/components/_navtabs.scss';

</style>

<style lang="scss">
@import '~/assets/scss/components/_buildingItem.scss';
@import '~/assets/scss/components/_infowindow.scss';
</style>
