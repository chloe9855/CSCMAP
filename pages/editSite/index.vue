<template>
  <div class="app" :class="{ 'hide-mee': $store.state.triggerHidden === true }">
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
    <div v-if="screenWidth > 1023" class="coordinates" :class="{'more-height': coldCube.x !== ''}">
      <!-- <div>滑鼠相對於地圖的 X 坐標：{{ mousePosition.x }}</div>
      <div>滑鼠相對於地圖的 Y 坐標：{{ mousePosition.y }}</div> -->
      <div class="co_cube">
        方格座標(X{{ coordinatesCube.x }}, Y{{ coordinatesCube.y }})
      </div>
      <div v-if="coldCube.x !== ''" class="co_cube2">
        冷三方格座標(X{{ coldCube.x }}, Y{{ coldCube.y }})
      </div>
      <div v-if="CubeNo !== undefined" class="co_cubeno">
        {{ cubeName }}: {{ CubeNo }}
      </div>
      <div class="co_TWD" :class="{'twd_push': coldCube.x !== ''}">
        TWD97({{ coordinatesTwd.x }},{{ coordinatesTwd.y }})
      </div>
    </div>

    <!-- 行動版幾何繪圖的準心 -->
    <div v-if="geometryMeasurer.aimpoint === true || pointMeasurer.aimpoint === true" class="aimpoint" />

    <!-- ↓↓ 在地圖API裡面需要用到的DOM -->
    <div :style="'display: none;'">
      <SingleCluster-component
        :item="singleClusterInfo"
        :my-type="singleClusterType"
        @click-detail="singleErpDetail"
      />

      <!-- <div
        id="meme1"
        :style="'width: 370px; border-radius: 10px;padding: 7px;background: white;'"
      >
        <div class="building__item theme-in-map">
          <div
            class="building__title has-icon"
            :class="`icon-type-${item.status}`"
          >
            第三冷主變電站
          </div>
          <div class="building__body">
            <div class="building__content">
              <p class="has-icon icon-building">
                <strong>各棟名稱</strong>{{ wowy }}
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
      </div> -->
    </div>

    <!-- 在 .building__item 添加 is-open 這個 class，選單項目就會展開 -->
    <div :style="'display: none;'">
      <div
        id="meme2"
        :style="'width: 370px; border-radius: 10px;padding: 0px 4px 6px; background: white; height: 176px; overflow: hidden; margin: -12px 0px 5px;'"
      >
        <div class="infowindow">
          <div class="infowindow__title">
            建物列表
          </div>
          <div ref="mycontent" class="infowindow__content theme-scrollbar">
            <MultiCluster-component
              :mycluster="multiClusterInfo"
              @click-detail="singleErpDetail"
              @scroll-top="scrollTopHandler"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- ↑↑ 在地圖API裡面需要用到的DOM -->

    <!-- 左側的搜尋選單 -->
    <QueryWindow-component
      v-if="$store.state.Url !== 'editSite'"
      ref="queryWindow"
      :open="queryWindowOpen"
      :condition="structureCondition"
      :buildtype="structureType"
      :result-type="searchResult.types"
      @control="payload => queryWindowOpen = payload"
      @search="searchHandler"
      @clearResult="clearSearchResultHandler"
      @nowSelect="payload => nowMode = payload"
      @clickLattice="openGridHandler"
      @clickStructure="hideGridHandler"
    >
      <QueryWindowContainer-component
        v-if="screenWidth > 1023 && searchResult.list.structure.length > 0 && nowMode === 'structure'"
        :result-type="nowMode"
        :result-number="searchResult.list.structure.length"
        @go-datail="allErpDetail"
        @update="sortTimeHandler"
      >
        <!-- 建物搜尋結果 -->
        <BuildingList-component
          v-if="nowMode === 'structure'"
          :items-list="searchResult.list.structure"
          :current-id="searchResult.currentBuilding"
          @click-block="focusBuildingHandler"
          @click-detail="singleErpDetail"
        />
      </QueryWindowContainer-component>

      <QueryWindowContainer-component
        v-if="screenWidth > 1023 && searchResult.list.lattice.length > 0 && nowMode === 'lattice'"
        :result-type="nowMode"
        :result-number="searchResult.list.structure.length"
        @go-datail="allErpDetail"
        @update="sortTimeHandler"
      >
        <!-- 方格搜尋結果 -->
        <LatticeListTable-component
          v-if="nowMode === 'lattice'"
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
      :iconcolor="switchBgColor"
      :screen-src="screenImgSrc"
      :cluster-bg="addClusterBg"
      @select="payload => activeWindow = payload"
      @setPositionAlert="ctrlPositionAlert"
      @hideTagBar="hideTagBarCtrl"
      @hideCluster="hideClusterHandler"
      @setOptions="setOptionsHandler"
      @backFullPic="gisMap.resetBounds()"
      @zoomIn="gisMap.ZoomIn()"
      @zoomOut="gisMap.ZoomOut()"
      @screenShot="screenShotHandler"
    />

    <a id="myShot" download="cscMap.png" :href="screenImgSrc" style="display: none;" @mousedown.prevent>shot</a>

    <!-- ERP 視窗（單筆點擊查詢結果） -->
    <transition
      name="popup-slide"
      mode="out-in"
    >
      <ClusterErpBox-component
        v-if="screenWidth < 1024 && $store.state.myErpCluster === true"
        :current-key="singleClusterKey"
        :clus-data="singleClusterInfo"
        @close="clusRows[clusRows.length - 1].selected = false"
      />
    </transition>

    <!-- ERP 視窗（建物搜尋結果） -->
    <transition
      name="popup-slide"
      mode="out-in"
    >
      <ErpContentBox-component
        v-if="screenWidth < 1024 && nowMode === 'structure' && searchResult.list.structure.length > 0"
        :items-list="searchResult.list.structure"
        :current-id="searchResult.currentBuilding"
        :clus-data="singleClusterInfo"
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
        v-if="screenWidth < 1024 && nowMode === 'lattice' && searchResult.list.lattice.length > 0"
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
          :graph-list="geometryOptions.graphList"
          :my-graphs="myGraphs"
          @allTypeList="payload => myTypeList = payload"
          @selectType="startDrawing"
          @deleteGraph="deleteGeometryItemHandler"
          @deleteAllGraph="deleteAllGeometryItemHandler"
          @goBack="backStepHandler"
          @cancel="cancelStepHandler"
          @modify="modifyStepHandler"
          @uploadAllGraph="uploadGraphHandler"
          @getPosition="getGeoItemPosition"
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
          @clearImg="clearPosImg"
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
          @clearImg="clearPosImg"
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
          :my-graphs="myGraphsProvider(['line', 'rect', 'poly', 'circle'])"
          @allTypeList="payload => myTypeList = payload"
          @selectType="startDrawing"
          @deleteGraph="deleteGeometryItemHandler2"
          @deleteAllGraph="deleteAllGeometryItemHandler2"
          @goBack="backStepHandler"
          @cancel="cancelStepHandler"
          @modify="modifyStepHandler"
          @getPosition="getGeoItemPosition"
        />
      </template>
    </DragBox-component>

    <!-- 手機版點測量 -->
    <transition
      name="popup-slide"
      mode="out-in"
    >
      <PopupBoxPoint-component
        v-if="ctrlPopupBoxVisible('mobileMeasureWindow')"
        :key="'measurePointPopup'"
        :name="'點測量結果'"
        :icon-name="'icon-pointback'"
        @close="closeMeasurePopupBox"
        @showBar="showTagBarCtrl"
        @back="backAllMeasure"
      >
        <div class="navtabs">
          <div class="navtabs__header">
            <a
              v-for="typeItem of pointMeasurer.typeList"
              :key="typeItem.id"
              href="javascript:;"
              class="navtabs__btn"
              :class="{ 'current': pointMeasurer.current === typeItem.id }"
              :title="typeItem.name"
              @click.stop="pointMeasurer.current = typeItem.id"
              @mousedown.prevent
            >
              <span>{{ typeItem.name }}</span>
            </a>
          </div>
          <div class="navtabs__body vv1">
            <div class="navtabs__content mea-mob">
              <div
                v-if="pointMeasurer.current === 'cscXy'"
                class="row is-flex-center go-margi"
                :style="'display: block !important;'"
              >
                <div id="copycsc3">
                  <p>
                    X{{ pointCscXy.x.toFixed(2) }} , Y{{ pointCscXy.y.toFixed(2) }}
                  </p>
                  <br>
                  <p v-if="pointColdXy.x !== ''">
                    (冷三坐標 X{{ pointColdXy.x.toFixed(2) }} , Y{{ pointColdXy.y.toFixed(2) }})
                  </p>
                </div>

                <div class="clone-container" :style="'margin-bottom: 10px !important;'">
                  <div class="clone-block" @click.stop="copyCoord('copycsc3')">
                    <div class="clone-pic1" />
                    <div class="clone-name1">
                      複製
                    </div>
                  </div>
                  <div class="clone-block" @click.stop="dxfUpload">
                    <div class="clone-pic2" :class="{ 'dxf-bg': haveUploaded === true }" />
                    <div class="clone-name2" :class="{ 'dxf-fo': haveUploaded === true }">
                      方格圖
                    </div>
                  </div>
                  <div class="clone-block">
                    <div class="clone-pic3" />
                    <div class="clone-name3" @click.stop="backAllMeasure">
                      重繪
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="pointMeasurer.current === 'cscNo'"
              >
                <p id="copyno">
                  {{ pointCscNo }}
                </p>
                <div class="clone-container">
                  <div class="clone-block" @click.stop="copyCoord('copyno')">
                    <div class="clone-pic1" />
                    <div class="clone-name1">
                      複製
                    </div>
                  </div>
                  <div class="clone-block" @click.stop="dxfUpload">
                    <div class="clone-pic2" :class="{ 'dxf-bg': haveUploaded === true }" />
                    <div class="clone-name2" :class="{ 'dxf-fo': haveUploaded === true }">
                      方格圖
                    </div>
                  </div>
                  <div class="clone-block">
                    <div class="clone-pic3" />
                    <div class="clone-name3" @click.stop="backAllMeasure">
                      重繪
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="pointMeasurer.current === 'twdXy'"
              >
                <p id="copytwd">
                  X{{ pointTwdXy.x.toFixed(2) }} , Y{{ pointTwdXy.y.toFixed(2) }}
                </p>
                <div class="clone-container">
                  <div class="clone-block" @click.stop="copyCoord('copytwd')">
                    <div class="clone-pic1" />
                    <div class="clone-name1">
                      複製
                    </div>
                  </div>
                  <div class="clone-block" @click.stop="dxfUpload">
                    <div class="clone-pic2" :class="{ 'dxf-bg': haveUploaded === true }" />
                    <div class="clone-name2" :class="{ 'dxf-fo': haveUploaded === true }">
                      方格圖
                    </div>
                  </div>
                  <div class="clone-block">
                    <div class="clone-pic3" />
                    <div class="clone-name3" @click.stop="backAllMeasure">
                      重繪
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopupBoxPoint-component>
    </transition>

    <!-- 手機版點/線/面測量 -->
    <transition
      name="popup-slide"
      mode="out-in"
    >
      <PopupBox-component
        v-if="ctrlPopupBoxVisible('measureWindow')"
        :key="'measurePopup'"
        :name="'測量距離/面積'"
        :icon-name="'icon-measure'"
        @close="closeMeasurePopupBox"
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
            <div class="navtabs__content mea-mob">
              <div class="notice-tips">
                <p>{{ geometryMeasurerDiscription }}</p>
              </div>
              <div
                v-if="geometryMeasurer.current === 'point'"
                class="row is-flex-center go-margi"
              >
                <a href="javascript:;" class="links-btn" title="完成" @click.stop="okHandler">
                  完成
                </a>
              </div>
              <div
                v-if="geometryMeasurer.current === 'line'"
              >
                <p>總長 {{ lineSum.toFixed(2) }} 公里</p>
                <div v-if="drawModeLine === true" class="row is-flex-center">
                  <a
                    href="javascript:;"
                    class="circle-btn icon-comeback"
                    title="返回"
                    @click.stop="backStepHandler"
                  >
                    <span>返回</span>
                  </a>
                  <a
                    href="javascript:;"
                    class="links-btn"
                    title="完成"
                    @click.stop="finishHandler"
                  >完成</a>
                  <a
                    href="javascript:;"
                    class="circle-btn icon-increase"
                    title="新增"
                    @click.stop="drawLineHandler"
                  >
                    <span>新增</span>
                  </a>
                </div>
                <a
                  v-if="drawModeLine === false"
                  href="javascript:;"
                  class="links-btn color-red"
                  title="重新繪製"
                  @click.stop="clearLineHandler"
                >重新繪製</a>
              </div>
              <div
                v-if="geometryMeasurer.current === 'surface'"
              >
                <p>總面積 {{ areaSum }} 平方公尺</p>
                <div v-if="drawModeArea === true" class="row is-flex-center">
                  <a
                    href="javascript:;"
                    class="circle-btn icon-comeback"
                    title="返回"
                    @click.stop="backStepHandler"
                  >
                    <span>返回</span>
                  </a>
                  <a
                    href="javascript:;"
                    class="links-btn"
                    title="完成"
                    @click.stop="finishHandler2"
                  >完成</a>
                  <a
                    href="javascript:;"
                    class="circle-btn icon-increase"
                    title="新增"
                    @click.stop="drawAreaHandler"
                  >
                    <span>新增</span>
                  </a>
                </div>
                <a
                  v-if="drawModeArea === false"
                  href="javascript:;"
                  class="links-btn color-red"
                  title="重新繪製"
                  @click.stop="clearAreaHandler"
                >重新繪製</a>
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
            v-if="$store.state.Url !== 'editSite'"
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
                    :key="layerItem.fid"
                    :class="{ 'is-active': layerOptions.current === 'addition' && layerOptions.active === layerItem.fid }"
                    @mouseenter="layerOptions.active = layerItem.fid"
                    @mouseleave="layerOptions.active = ''"
                  >
                    <td>
                      <div class="layersTable__btn">
                        {{ layerItem.title }}
                      </div>
                    </td>
                    <td>
                      <ViewCheckbox
                        :id="layerItem.fid"
                        :visible="layerItem.visible"
                        :file="layerItem.myLayerFile"
                        @change="layerVisibleHandler"
                      />
                    </td>
                    <td>
                      <OpacityController
                        :id="layerItem.fid"
                        :value="layerItem.opacity"
                        :file="layerItem.myLayerFile"
                        @update="updateLayerOpacities"
                      />
                    </td>
                  </tr>
                  <tr
                    v-if="layerOptions.current === 'addition'"
                    v-show="layerOptions.active === layerItem.fid"
                    :key="`table-detail_${layerItem.fid}`"
                    :class="{ 'is-active': layerOptions.current === 'addition' && layerOptions.active === layerItem.fid }"
                    @mouseenter="layerOptions.active = layerItem.fid"
                    @mouseleave="layerOptions.active = ''"
                  >
                    <td class="layersTable__detail" colspan="3">
                      <div class="btn-group is-flex-end">
                        <a
                          href="javascript:;"
                          class="btn color-light-blue size-small has-front-icon icon-location"
                          title="定位"
                          @click.stop="setLayerPositionHandler(layerItem.fid, layerItem.myLayerFile)"
                          @mousedown.prevent
                        >
                          <span>定位</span>
                        </a>
                        <a
                          href="javascript:;"
                          class="btn color-light-blue size-small has-front-icon icon-delete"
                          title="移除"
                          @click.stop="deleteLayerHandler(layerItem.fid, layerItem.myLayerFile)"
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
              @click.stop="selectFileModal = true"
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
            <tr v-for="layerItem of switchLayerProvider('local')" :key="layerItem.fid">
              <td>
                <div class="layersTable__btn">
                  {{ layerItem.title }}
                </div>
              </td>
              <td>
                <ViewCheckbox
                  :id="layerItem.fid"
                  :visible="layerItem.visible"
                  :file="layerItem.myLayerFile"
                  @change="layerVisibleHandler"
                />
              </td>
              <td>
                <OpacityController
                  :id="layerItem.fid"
                  :value="layerItem.opacity"
                  :file="layerItem.myLayerFile"
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

    <!-- 畫面截圖的lightbox -->
    <div v-if="screenShotModal === true" class="modal_wrapper">
      <div class="modal">
        <p class="p3 screen-modal">
          檔案下載中，請稍後
        </p>
      </div>
    </div>

    <!-- 加入圖層的lightbox -->
    <div v-if="selectFileModal === true" class="modal_wrapper">
      <div class="modal">
        <div class="close-modal" @click.stop="selectFileModal = false" />
        <p class="p1">
          請選擇您的DXF檔案
        </p>
        <p class="p2">
          上傳檔案大小以2MB為限，<br>如超過將使系統運作不穩！
        </p>
        <label for="upfile" class="file-button">選擇檔案
          <input
            id="upfile"
            type="file"
            accept=".dxf"
            style="display: none;"
            @change="updateFileHandler()"
          >
        </label>
      </div>
    </div>

    <div v-if="over2Modal === true" class="modal_wrapper">
      <div class="modal">
        <div class="close-modal" @click.stop="over2Modal = false" />
        <p class="p1">
          檔案已超過2MB，加入圖層會使系統<br>運作不穩，請問是否繼續執行？
        </p>
        <div class="flex-group">
          <div class="file-button-cancel" @click.stop="over2Modal = false, nowFile = '', selectFileModal = true">
            取消
          </div>
          <div class="file-button" @click.stop="continueUpload">
            確定
          </div>
        </div>
      </div>
    </div>

    <div v-if="over8Modal === true" class="modal_wrapper">
      <div class="modal">
        <div class="close-modal" @click.stop="over8Modal = false" />
        <div class="forbidden" />
        <p class="p2 add8">
          檔案大小超過8MB
        </p>
        <p class="p2 add8">
          請重新選擇您的DXF檔案
        </p>
        <label for="upfile" class="file-button">選擇檔案
          <input
            id="upfile"
            type="file"
            accept=".dxf"
            style="display: none;"
            @change="updateFileHandler()"
          >
        </label>
      </div>
    </div>

    <div v-if="updateModal === true" class="modal_wrapper">
      <div class="modal">
        <div class="close-modal" @click.stop="updateModal = false" />
        <div class="title-img">
          <div class="title-img2" />
          <div class="title-img3">
            {{ fileName }}
          </div>
        </div>
        <p class="p3">
          更新中
        </p>
        <div class="bar" />
      </div>
    </div>

    <div v-if="completeModal === true" class="modal_wrapper">
      <div class="modal">
        <div class="close-modal" @click.stop="completeModal = false" />
        <div class="title-img">
          <div class="title-img2" />
          <div class="title-img3">
            {{ fileName }}
          </div>
        </div>
        <p class="p3">
          上傳完成
        </p>
        <div class="okpic" />
        <div class="file-button" @click.stop="completeModal = false">
          確認
        </div>
      </div>
    </div>

    <!-- 手機版 點測量 視窗 -->
    <div v-if="gisWarnModal === true" class="modal_wrapper">
      <div class="modal ww1">
        <div class="close-modal" @click.stop="gisWarnModal = false" />
        <p class="ww2">
          GIS測量坐標值僅供參考，
        </p>
        <p>
          不得作證明文件使用。
        </p>
        <div class="file-button ww3" @click.stop="drawPointHandler">
          確定
        </div>
      </div>
    </div>

    <!-- 手機版 點測量 複製視窗 -->
    <div v-if="copyOkModal === true" class="modal_wrapper">
      <div class="modal ww5" :style="'width: 345px !important;'">
        <div class="copyok" />
        <div v-if="pointMeasurer.current === 'cscXy'">
          <p>
            X{{ pointCscXy.x.toFixed(2) }} , Y{{ pointCscXy.y.toFixed(2) }}
          </p>
          <p v-if="pointColdXy.x !== ''">
            (冷三坐標 X{{ pointColdXy.x.toFixed(2) }} , Y{{ pointColdXy.y.toFixed(2) }})
          </p>
        </div>
        <div v-if="pointMeasurer.current === 'cscNo'">
          <p>
            {{ pointCscNo }}
          </p>
        </div>
        <div v-if="pointMeasurer.current === 'twdXy'">
          <p>
            X{{ pointTwdXy.x.toFixed(2) }} , Y{{ pointTwdXy.y.toFixed(2) }}
          </p>
        </div>
        <p>
          複製成功
        </p>
      </div>
    </div>

    <!-- 我的位置視窗 -->
    <transition
      name="popup-slide"
      mode="out-in"
    >
      <PositionAlert-component
        v-if="positionAlert.isOpen === true"
        :reference="positionAlert.reference"
        :csc="myCsc"
        :twd="myTwd"
        :cubeno="myCubeNo"
        :cubename="myCubeName"
        :cold="myCold"
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
import SingleCluster from '~/components/SingleCluster';
import MultiCluster from '~/components/MultiCluster';
import ClusterErpBox from '~/components/ClusterErpBox';
import PopupBoxPoint from '~/components/PopupBoxPoint';

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
          { id: 0, name: '方格坐標' },
          { id: 1, name: '方格圖號' },
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
            description: '請以滑鼠點擊後拖曳，放開滑鼠即完成矩形建地。'
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
      // * 暫存幾何繪圖結果
      myGraphs: [],
      // * 個別圖形總面積
      totalArea: [],
      // * 圓半徑
      circleRadius: [],
      // * 目前編輯完成的那筆
      saveIndex: '',
      // * 繪圖選項種類
      myTypeList: [],
      // * 監聽儲存狀態
      unSave: false,
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
      // * 點測量的控制欄（行動版）
      measurePointBox: false,
      mobPoint: '',
      haveUploaded: false,
      gisWarnModal: false,
      copyOkModal: false,
      pointMeasurer: {
        // 目前選取的圖形類別
        current: 'cscXy',
        // 圖形類別
        typeList: [
          {
            id: 'cscXy',
            name: '方格坐標'
          },
          {
            id: 'cscNo',
            name: '方格圖號'
          },
          {
            id: 'twdXy',
            name: 'TWD97'
          }
        ],
        // 準心
        aimpoint: false
      },
      // * 幾何繪圖的控制欄（行動版） 線段總長
      lineSum: 0,
      areaSum: 0,
      drawModeLine: true,
      drawModeArea: true,
      drawPoint: '',
      // * 幾何繪圖的控制欄（行動版） 點測量
      pointCscNo: '',
      pointCscXy: {
        x: '',
        y: ''
      },
      pointTwdXy: {
        x: '',
        y: ''
      },
      pointColdXy: {
        x: '',
        y: ''
      },
      // * 建物搜尋條件選項 建物狀態all
      mymy: '',
      structureCondition: [],
      // * 建物搜尋條件選項 建物類型all
      structureType: [],
      // * 建物搜尋 使用者搜尋時所選擇的關鍵字、建物狀態、建物類型
      searchSelected: {
        keyword: '',
        status: '',
        types: ''
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
      coldCube: {
        x: '',
        y: ''
      },
      cubeName: '',
      // * 地圖載入
      gisMap: '',
      // * 控制球標顯示/隱藏變數
      markerVisible: true,
      addClusterBg: false,
      // * 圖北切換
      switchOptions: '',
      // * 圖北切換icon背景色
      switchBgColor: false,
      // * 畫面截圖url
      screenImgSrc: '',
      screenShotModal: false,
      // * 加入圖層視窗
      selectFileModal: false,
      updateModal: false,
      completeModal: false,
      over2Modal: false,
      over8Modal: false,
      nowFile: {},
      fileName: '',
      myLayer: {},
      singleErpModal: false,
      multiErpModal: true,
      // 球標假資料
      clusterInfo: [],
      // * 單筆/多筆球標查詢
      singleClusterInfo: '',
      singleClusterType: '',
      multiClusterInfo: [],
      singleClusterKey: '',
      // 展開多筆清單
      openList: false,
      // * @ 我的位置
      // * 方格座標
      myCsc: {
        x: '',
        y: ''
      },
      // * 方格圖號
      myCubeNo: '',
      // * TWD座標
      myTwd: {
        x: '',
        y: ''
      },
      myCold: {
        x: '',
        y: ''
      },
      myCubeName: '',
      // * @ 單筆點擊球標陣列
      clusRows: [],
      // * 使用者權限角色
      myRole: '',
      // * 查詢載入方格圖權限
      canSearchGrid: null,
      // * 我的位置
      bluep: '',
      bluepAll: [],
      pGISSymbo: '',
      markerImg: '',
      markerImgAll: [],
      // * 方格圖號定位
      gridX: '',
      gridY: '',
      // * 建物/方格選單切換狀態
      nowMode: '',
      // * 使用者自設邊界、方格圖文字設定
      uCSC: {
        x: '',
        y: '',
        x2: '',
        y2: ''
      },
      uCRM: {
        x: '',
        y: '',
        x2: '',
        y2: ''
      },
      gridWord: null,
      // * 從後端傳來的 編輯用圖台預定地編號(取名陣列)
      landId: [],
      geoJson: '',
      userId: '',
      manageId: '',
      myCounter: 0,
      setCount: 0,
      newEditRows: [],
      frRows: []
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
    'SingleCluster-component': SingleCluster,
    'MultiCluster-component': MultiCluster,
    'ClusterErpBox-component': ClusterErpBox,
    'PopupBoxPoint-component': PopupBoxPoint,
    OpacityController,
    ViewCheckbox
  },
  mounted () {
    this.getDefaultData();
    this.$store.commit('GET_NOW_URL', 'editSite');
    this.$store.commit('CLEAR_BUTTON_HANDLER', false);

    // 開啟預定地視窗
    this.activeWindow = 'addLandWindow';

    this.getPositionData();

    // * 接後端塞的值
    this.getMySession();
  },
  beforeDestroy () {
    clearTimeout(this.positionAlert.timer);
  },
  methods: {
    getMySession () {
      if (sessionStorage.getItem('iptUserID') !== '') {
        this.userId = sessionStorage.getItem('iptUserID');
        this.manageId = sessionStorage.getItem('iptManageSerial');
      }

      if (sessionStorage.getItem('iptLandData') !== '') {
        this.geoJson = JSON.parse(sessionStorage.getItem('iptLandData'));
        this.landId = this.geoJson.map(item => item.building.key);
      }
    },
    // ? 載入預設需要載入的資料
    getDefaultData () {
      // 開啟 Loading 視窗
      this.$store.commit('CTRL_LOADING_MASK', true);

      // ? 用 setTimeout 模擬 ajax 完成的狀態給人看
      setTimeout(() => {
        // ! 取得建物搜尋條件，這邊應該要用 ajax 抓資料回來
        this.getStructureType();

        // this.structureCondition = require('~/static/_resources/structureStatus.json');
        this.mymy = require('~/static/_resources/structureStatus.json');
        this.structureCondition = this.mymy.data;

        // ! 取得預設圖層，這邊應該要用 ajax 抓資料回來
        this.getDefaultLayer();
        // const _layers = require('~/static/_resources/defaultLayerList.json');
        // this.layerOptions.layerList = [..._layers.data];

        // ! 取得球標資料，這邊應該要用 ajax 抓資料回來
        const cluster = require('~/static/_resources/test.json');
        this.clusterInfo = [...cluster.data];

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

        // * 關閉群聚點
        this.gisMap.setupMarker({ visible: false });

        CSC.GISEvent.addListener(map, 'click', () => {
          this.mapClickHandler();
        });

        // 滑鼠坐標
        CSC.GISEvent.addListener(map, 'mousemove', (e) => {
          this.coordinatesCube.x = map.coordinateInfo(e.point).CSC.x.toFixed(2);
          this.coordinatesCube.y = map.coordinateInfo(e.point).CSC.y.toFixed(2);
          this.CubeNo = map.coordinateInfo(e.point).GridNO;
          this.coordinatesTwd.x = map.coordinateInfo(e.point).TWD97.x.toFixed(2);
          this.coordinatesTwd.y = map.coordinateInfo(e.point).TWD97.y.toFixed(2);
          if (typeof map.coordinateInfo(e.point).CRM !== 'undefined') {
            this.coldCube.x = map.coordinateInfo(e.point).CRM.x.toFixed(2);
            this.coldCube.y = map.coordinateInfo(e.point).CRM.y.toFixed(2);
            this.cubeName = '冷三方格圖號';
          } else {
            this.cubeName = '方格圖號';
            this.coldCube.x = '';
            this.coldCube.y = '';
          }
        });

        // * 單筆/群聚點擊查詢
        CSC.GISEvent.addListener(map, 'markerclick', (e) => {
          console.log(e.markers);
          e.mouseEvent.stopPropagation();
          if (e.markers.length <= 10 && e.markers.length > 1 && this.screenWidth > 1023) {
            const infoMulti = document.getElementById('meme2');
            const newArr = [];
            e.markers.forEach((item) => {
              newArr.push(item.data.key);
            });
            const multiKey = newArr.join(',');
            this.getMultiCluster(multiKey);

            // 關閉單筆點擊的變色
            this.clusRows.forEach((item) => {
              item.selected = false;
            });

            this.gisMap.showInformation(
              e.center,
              infoMulti,
              {}
            );
          } else if (e.markers.length === 1 && this.screenWidth > 1023) {
            // const eMarker = [];
            this.clusRows.push(e.markers[0]);
            // 只有最新的那筆(目前點的)球標會變色
            this.clusRows.forEach((item) => {
              item.selected = false;
            });
            this.clusRows[this.clusRows.length - 1].selected = true;

            const infoBox = document.getElementById('meme1');
            const singleKey = e.markers[0].data.key;
            this.getSingleCluster(singleKey);
            this.singleClusterType = e.markers[0].data.type;

            // 開啟訊息視窗
            this.gisMap.showInformation(
              e.center, // 訊息視窗位置
              // e.markers.map((m) => { return m.data.key; }).join('<br />'),
              infoBox, // 訊息內容
              {}
            );
          } else if (e.markers.length === 1 && this.screenWidth < 1024 && this.searchResult.list.structure.length <= 0) {
            this.clusRows.push(e.markers[0]);
            // 只有最新的那筆(目前點的)球標會變色
            this.clusRows.forEach((item) => {
              item.selected = false;
            });
            this.clusRows[this.clusRows.length - 1].selected = true;

            // 抓key值
            this.singleClusterKey = e.markers[0].data.key;
            this.getSingleCluster(this.singleClusterKey);
            this.$store.commit('ERP_CLUSTER_BOX', true);
          } else if (e.markers.length === 1 && this.screenWidth < 1024 && this.searchResult.list.structure.length > 0) {
            this.clusRows.push(e.markers[0]);
            // 只有最新的那筆(目前點的)球標會變色
            this.clusRows.forEach((item) => {
              item.selected = false;
            });
            this.clusRows[this.clusRows.length - 1].selected = true;

            // 抓key值
            this.singleClusterKey = e.markers[0].data.key;
            this.getSingleCluster(this.singleClusterKey);
            this.$store.commit('ERP_CLUSTER_BOX_RECORD', true);
          } else {
            // 關閉訊息視窗
            this.gisMap.showInformation();
          }
        });

        // * 監聽單筆點擊 關閉視窗
        CSC.GISEvent.addListener(this.gisMap, 'informationclosed', (e) => {
          this.clusRows[this.clusRows.length - 1].selected = false;
        });

        // 設定球標顯示
        // this.gisMap.setupMarker({ visible: true });
        // 設定圖層顯示、透明度
        // this.gisMap.setupLayer({ fid: 10, visible: false, opacity: 100 });
        // 設定繪圖
        this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, {
          textOptions: { fontColor: '#000000', font: 'Microsoft Jhenghei', fontSize: '16px' },
          strokeOptions: { strokeColor: '#000000', strokeWeight: 2 },
          fillOptions: { strokeColor: '#000000', fillOpacity: 0.3 },
          tipSkin: '<div class=\'contentArea\' style=\'background-color:blanchedalmond;color:coral;border-radius:5px;\'></div>'
        });

        // * 接收ERP傳來的圖形資料
        if (this.geoJson !== '') {
          this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { measure: true });

          this.geoJson.forEach((item, index) => {
            this.myGraphs.push(new CSC.GISFill(this.gisMap, CSC.GISGeometry.fromJson(item.geometry), { strokeColor: '#000000', strokeWeight: 2, fillOpacity: 0.3, fillColor: '#8D2683' }));

            this.totalArea.push(this.myGraphs[index].getPath().getArea().toFixed(2));
            if (item.geometry.type === 'Circle') {
              this.circleRadius.push(this.myGraphs[index].getPath().getRadius().toFixed(2));
              // 圓形加上type
              this.myGraphs[index].type = 'circleLand';
            }

            // 找到要編輯的圖形
            const editme = this.myGraphs[index];
            // 啟用編輯圖形
            this.gisMap.drawingMethod(CSC.DrawingMethod.Modify, { overlay: editme });
            // 取消
            this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { mode: CSC.GISOverlayType.NONE });

            const result = {
              id: `geometry_${this.GET_RESOURCE_ID()}`,
              name: item.building.key,
              type: item.geometry.type,
              coordinate: [],
              detail: this.totalArea[this.totalArea.length - 1],
              controlBar: false,
              radius: this.circleRadius[this.circleRadius.length - 1]
            };

            this.geometryOptions.graphList.push(result);
          });
        }

        // 暫存繪圖結果
        CSC.GISEvent.addListener(this.gisMap, 'draw_complete', (p) => {
          // 閃爍
          p.overlay.blink(2, 100, [1]);
          // console.log(JSON.stringify(p.overlay.toJson()));
          // 畫完圖形後
          if (p.action === 'ADD') {
            // 暫存圖形
            this.myGraphs.push(p.overlay);

            // 取得總面積
            if (this.geometryOptions.current !== 'line' && this.geometryMeasurer.current !== 'line') {
              this.totalArea.push(p.overlay.getPath().getArea().toFixed(2));
            }

            // 取得圓半徑
            if (this.geometryOptions.current === 'circleLand' || this.geometryOptions.current === 'circle' || this.geometryOptions.current === 'line' || this.geometryMeasurer.current === 'line') {
              this.circleRadius.push(p.overlay.getPath().getRadius().toFixed(2));
            }

            // 鎖點測量 線段長度
            if (this.geometryMeasurer.current === 'line') {
              this.lineSum = 0;
              console.log(p.overlay);
              p.overlay.measure.forEach((item) => {
                const unit = item.label.substring(item.label.length - 2, item.label.length - 1);
                let value;
                if (unit === 'k') {
                  value = parseFloat(item.label.substring(0, item.label.length - 2));
                } else {
                  value = parseFloat(item.label.substring(0, item.label.length - 1)) / 1000;
                }
                console.log(value);
                this.lineSum += value;
              });
            }

            if (this.geometryMeasurer.current === 'surface') {
              this.areaSum = p.overlay.getPath().getArea().toFixed(2);
            }

            if (this.geometryMeasurer.current === 'surface' || this.geometryMeasurer.current === 'line' || this.geometryMeasurer.current === 'point') {
              this.measurerHandler();
            }

            // 新增預定地
            this.createGeometryItemHandler();
            this.geometryOptions.current = '';
            this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { mode: CSC.GISOverlayType.NONE });
            this.unSave = true;

            //  手機版點線面測量
            // this.measurerHandler();
          }

          // 修改完成後
          if (p.action === 'SAVE') {
            this.myGraphs[this.saveIndex] = p.overlay;
            if (this.myGraphs[this.saveIndex].type !== 'line') {
              this.geometryOptions.graphList[this.saveIndex].detail = p.overlay.getPath().getArea().toFixed(2);
            }
            if (this.myGraphs[this.saveIndex].type === 'circleLand') {
              this.geometryOptions.graphList[this.saveIndex].radius = p.overlay.getPath().getRadius().toFixed(2);
            }
            // this.geometryOptions.graphList[this.saveIndex].radius = p.overlay.measure[0].label;
            this.geometryOptions.graphList[this.saveIndex].controlBar = false;
          }

          // 偵測是否有沒被送出的預定地資料 + 偵測繪製預定用地是否重疊
          if (!this.myTypeList.includes('line', 'rect', 'poly', 'circle') && this.screenWidth > 1023) {
            // 監聽儲存狀態
            window.addEventListener('beforeunload', (e) => {
              if (this.unSave === true) {
                (e || window.event).returnValue = '';
                return '';
              }
              return undefined;
            });
            // 偵測重疊
            if (p.overlay instanceof CSC.GISFill) {
              p.overlay.setFillColor(p.intersects ? '#FFFF00' : '#8D2683');
            }
            if (p.intersects) {
              this.$swal({
                icon: 'warning',
                width: 402,
                text: '新繪製建地有重疊',
                confirmButtonText: '確定',
                showCloseButton: true
              });

              // console.log(p.intersects.filter(function (x) { return x instanceof CSC.GISMarker && x.data; }).map(function (x) { return x.data.key; }));
              // console.log(p.intersects);
            }
          }
        });
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
    getPositionData () {
      fetch('/cscmap2/CustomSetting.json', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        this.uCSC.x = data.CSC[0].x;
        this.uCSC.y = data.CSC[0].y;
        this.uCSC.x2 = data.CSC[1].x;
        this.uCSC.y2 = data.CSC[1].y;
        this.uCRM.x = data.CRM[0].x;
        this.uCRM.y = data.CRM[0].y;
        this.uCRM.x2 = data.CRM[1].x;
        this.uCRM.y2 = data.CRM[1].y;
        this.gridWord = data.gridString;
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * @坐標查詢：控制地圖API，移動至對應的坐標查詢
    setPositionHandler () {
      // 按下定位後關閉手機鍵盤
      document.activeElement.blur();
      // TWD定位
      if (this.positionOptions.current === 2) {
        const reg = /^(-?(?:[0-9])*(?:\.[0-9]+)?)$/;
        const result1 = reg.test(this.positionOptions.twdPosition.x);
        const result2 = reg.test(this.positionOptions.twdPosition.y);

        if (result1 === false || result2 === false || this.positionOptions.twdPosition.x === '' || this.positionOptions.twdPosition.y === '') {
          this.$swal({
            text: '輸入格式有誤，請輸入數字',
            width: 402,
            confirmButtonText: '確定',
            showCloseButton: true
          });
        } else {
          const myTwd = CSC.CoordTrans('EPSG3826', 'CSC', { x: this.positionOptions.twdPosition.x, y: this.positionOptions.twdPosition.y });
          const imgUrl = require('~/assets/img/point-po.svg');

          this.gisMap.setCenter(myTwd);
          this.markerImg = new CSC.GISMarker(this.gisMap, myTwd, null, new CSC.GISImage(imgUrl, new CSC.GISSize(26, 35)));
          this.markerImg.setFlat(true);

          // 放大
          const myArr = [{ x: myTwd.x + 50, y: myTwd.y + 50 }, { x: myTwd.x + 50, y: myTwd.y - 50 }, { x: myTwd.x - 50, y: myTwd.y - 50 }, { x: myTwd.x - 50, y: myTwd.y + 50 }];
          this.gisMap.fitBounds(new CSC.GISEnvelope(myArr), 1.25);
        }
      }

      // 方格圖號定位
      if (this.positionOptions.current === 1) {
        const reg = /^((-?|\+?)?[0-9]{4},){0,3}?((-?|\+?)?[0-9]{4})$/;
        const result = reg.test(this.positionOptions.gridNumber);
        const gridNum = this.positionOptions.gridNumber;
        if (result === false) {
          this.$swal({
            text: '輸入格式有誤，請輸入數字',
            width: 402,
            confirmButtonText: '確定',
            showCloseButton: true
          });
          return;
        }

        if (gridNum < 0) {
          this.gridX = parseInt(gridNum.toString().substring(0, 3), 10);
          this.gridY = parseInt(gridNum.toString().substring(3, 5), 10);
        } else if (gridNum > 0) {
          this.gridX = parseInt(gridNum.toString().substring(0, 2), 10);
          this.gridY = parseInt(gridNum.toString().substring(2, 4), 10);
        }

        if ((this.gridX <= 65 && this.gridX >= 52 && this.gridY >= 90 && this.gridY <= 99) || (this.gridX < 28 && this.gridX >= -4 && this.gridY >= 35 && this.gridY < 64)) {
          this.gisMap.fitBounds(new CSC.GISEnvelope(this.gisMap.gridInfo(this.positionOptions.gridNumber).CSC), 1.25);
          console.log(this.gisMap.gridInfo(this.positionOptions.gridNumber));
        } else {
          this.$swal({
            text: '輸入非中鋼方格圖系統，請重新輸入！',
            width: 402,
            confirmButtonText: '確定',
            showCloseButton: true
          });
        }
      }

      // 方格坐標定位
      if (this.positionOptions.current === 0) {
        const cscX = this.positionOptions.gridPosition.x;
        const cscY = this.positionOptions.gridPosition.y;
        const imgUrl = require('~/assets/img/point-po.svg');

        const reg = /^(-?(?:[0-9])*(?:\.[0-9]+)?)$/;
        const result1 = reg.test(cscX);
        const result2 = reg.test(cscY);
        if (result1 === false || result2 === false || cscX === '' || cscY === '') {
          this.$swal({
            text: '輸入格式有誤，請輸入數字',
            width: 402,
            confirmButtonText: '確定',
            showCloseButton: true
          });
          return;
        }

        if ((cscX >= uCSC.x && cscX <= uCSC.x2) && (cscY >= uCSC.y && cscY <= uCSC.y2)) {
          const myCsc = new CSC.GISPoint(cscX, cscY);

          this.gisMap.setCenter(myCsc);
          this.markerImg = new CSC.GISMarker(this.gisMap, myCsc, null, new CSC.GISImage(imgUrl, new CSC.GISSize(26, 35)));
          this.markerImg.setFlat(true);

          // 放大
          const myArr2 = [{ x: myCsc.x + 50, y: myCsc.y + 50 }, { x: myCsc.x + 50, y: myCsc.y - 50 }, { x: myCsc.x - 50, y: myCsc.y - 50 }, { x: myCsc.x - 50, y: myCsc.y + 50 }];
          this.gisMap.fitBounds(new CSC.GISEnvelope(myArr2), 1.25);
        } else {
          // 超出的一律當冷三 把他輸入的坐標當冷三 先轉成中鋼方格坐標
          const myCold = CSC.CoordTrans('3CRM', 'CSC', { x: cscX, y: cscY });
          if ((myCold.x >= uCRM.x && myCold.x <= uCRM.x2) && (myCold.y > uCRM.y && myCold.y <= uCRM.y2)) {
            this.gisMap.setCenter(myCold);
            this.markerImg = new CSC.GISMarker(this.gisMap, myCold, null, new CSC.GISImage(imgUrl, new CSC.GISSize(26, 35)));
            this.markerImg.setFlat(true);

            // 放大
            const myArr3 = [{ x: myCold.x + 50, y: myCold.y + 50 }, { x: myCold.x + 50, y: myCold.y - 50 }, { x: myCold.x - 50, y: myCold.y - 50 }, { x: myCold.x - 50, y: myCold.y + 50 }];
            this.gisMap.fitBounds(new CSC.GISEnvelope(myArr3), 1.25);
          } else {
            this.$swal({
              text: '輸入非中鋼方格圖系統，請重新輸入！',
              width: 402,
              confirmButtonText: '確定',
              showCloseButton: true
            });
          }
        }
      }

      this.markerImgAll.push(this.markerImg);
      if (this.markerImgAll.length > 1) {
        this.gisMap.drawingMethod(CSC.DrawingMethod.Remove, { overlay: this.markerImgAll.splice(0, 1)[0] });
      }
    },
    // * @坐標定位：按下清除使圖標消失
    clearPosImg () {
      this.gisMap.drawingMethod(CSC.DrawingMethod.Remove, { overlay: this.markerImgAll.splice(0, 1)[0] });
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
              const lat = data.coords.latitude;
              const lon = data.coords.longitude;
              console.log(lat + ',' + lon);
              // 中鋼坐標
              const corTrans = CSC.CoordTrans('EPSG4326', 'CSC', { x: lon, y: lat });

              console.log(CSC.CoordTrans('EPSG4326', 'CSC', { x: lon, y: lat }));
              console.log(corTrans.x);

              // TWD&方格坐標 (中鋼坐標=換算出來的方格坐標)
              console.log(this.gisMap.coordinateInfo(CSC.CoordTrans('EPSG4326', 'CSC', { x: lon, y: lat })));
              this.myCsc.x = this.gisMap.coordinateInfo(corTrans).CSC.x.toFixed(2);
              this.myCsc.y = this.gisMap.coordinateInfo(corTrans).CSC.y.toFixed(2);
              this.myTwd.x = this.gisMap.coordinateInfo(corTrans).TWD97.x.toFixed(2);
              this.myTwd.y = this.gisMap.coordinateInfo(corTrans).TWD97.y.toFixed(2);
              if (this.gisMap.coordinateInfo(corTrans).GridNO !== undefined) {
                this.myCubeNo = this.gisMap.coordinateInfo(corTrans).GridNO;
              }

              if (typeof this.gisMap.coordinateInfo(corTrans).CRM !== 'undefined') {
                this.myCold.x = this.gisMap.coordinateInfo(corTrans).CRM.x.toFixed(2);
                this.myCold.y = this.gisMap.coordinateInfo(corTrans).CRM.y.toFixed(2);
                this.myCubeName = '冷三方格圖號';
              } else {
                this.myCubeName = '方格圖號';
                this.myCold.x = '';
                this.myCold.y = '';
              }

              // 定位
              this.gisMap.setCenter(corTrans);
              if (this.bluep !== '') {
                this.bluep.destroy();
              }

              const imgUrl = require('~/assets/img/mycircle.svg');
              this.bluep = new CSC.GISMarker(this.gisMap, (corTrans), null, new CSC.GISImage(imgUrl, new CSC.GISSize(20, 20), corTrans, new CSC.GISPoint(10, 10)));
              // this.bluep = new CSC.GISMarker(this.gisMap, corTrans, null, this.pGISSymbo); // 用幾何圖形建立標記點

              this.bluepAll.push(this.bluep);
              if (this.bluepAll.length > 1) {
                this.gisMap.drawingMethod(CSC.DrawingMethod.Remove, { overlay: this.bluepAll.splice(0, 1)[0] });
              }

              this.bluep.setFlat(true);
              // this.addSymbo();
              // this.bluep.setIcon(this.pGISSymbo);

              this.CONSOLE('【我的位置】根據瀏覽器位置調整坐標資訊');
              this.positionAlert.isOpen = true;
              this.positionAlert.timer = setTimeout(() => {
                this.closePositionAlert();
              }, 3000);
            }, (err) => {
              console.log(err);

              this.$swal({
                icon: 'error',
                width: 402,
                text: '坐標資訊取得失敗',
                confirmButtonText: '確定',
                showCloseButton: true
              });
            });
          } else {
            this.$swal({
              icon: 'error',
              width: 402,
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
    // * 圖層顯示或隱藏
    layerVisibleHandler ($event, id, file) {
      if (this.layerOptions.current === 'local') {
        this.gisMap.setupLayer({ fid: id, visible: $event });
        console.log(`id ${id} 是否顯示 ${$event}`);
      } else if (this.layerOptions.current === 'addition') {
        console.log(file);
        this.gisMap.setupLayer({ layer: file, visible: $event });
      }
    },
    // * @圖層切換調整：修改透明度數值
    updateLayerOpacities (id, value, file) {
      /*
        當透明度控制器（@OpacityController）的資料更新時
        同步更新對應項目的資料
       */
      // const { layerList } = this.layerOptions;
      // const index = layerList.findIndex(item => item.id === id);
      // layerList[index].opacity = value;
      if (this.layerOptions.current === 'local') {
        this.gisMap.setupLayer({ fid: id, opacity: value });
        console.log(`id ${id}  value ${value}`);
      } else if (this.layerOptions.current === 'addition') {
        console.log(file);
        this.gisMap.setupLayer({ layer: file, opacity: value });
      }
    },
    // * @圖層切換調整：刪除圖層
    deleteLayerHandler (id, file) {
      const { layerList } = this.layerOptions;
      const index = layerList.findIndex(item => item.id === id);
      layerList.splice(index, 1);

      if (this.layerOptions.current === 'addition') {
        this.gisMap.removeLayer(file);
      }
    },
    // * @圖層切換調整：圖層定位
    setLayerPositionHandler (id, file) {
      // 根據 id 去 this.layerOptions.layerList 取得對應的資料更新地圖
      this.CONSOLE('【圖層調整】根據所選的圖層項目調整地圖定位');
      this.gisMap.setupLayer({ layer: file, bounds: 1.25 });
    },
    // * @圖層切換調整：資料篩選
    switchLayerProvider (currentName) {
      /*
        所有圖層項目都是放在 this.layerOptions.layerList
        透過 currentName（我的圖層：local、加入圖層：addition）來篩選出對應的資料
       */
      return this.layerOptions.layerList.filter((item) => {
        return item.type === currentName && item.inUse === true;
      });
    },
    // ? @圖層切換調整：新增圖層 上傳檔案
    updateFileHandler () {
      this.over8Modal = false;
      const newFile = document.getElementById('upfile').files[0];
      const fileSize = document.getElementById('upfile').files[0].size;
      this.nowFile = newFile;
      this.fileName = newFile.name;
      console.log(this.nowFile);
      if (fileSize <= 2097152) {
        this.selectFileModal = false;
        this.updateModal = true;
        this.gisMap.appendDXF(newFile, (lyr) => {
          window.dxfLayer = lyr;
          this.myLayer = lyr;
          console.log(lyr);
          // 確定上面都做完後才會執行下面的
          setTimeout(() => {
            this.addLayerHandler();
            this.updateModal = false;
            this.completeModal = true;
          }, 500);
        });
      } else if (fileSize > 2097152 && fileSize <= 8388608) {
        this.selectFileModal = false;
        this.over2Modal = true;
      } else if (fileSize > 8388608) {
        this.selectFileModal = false;
        this.over8Modal = true;
      }
    },
    continueUpload () {
      this.over2Modal = false;
      this.updateModal = true;
      this.gisMap.appendDXF(this.nowFile, (lyr) => {
        window.dxfLayer = lyr;
        this.myLayer = lyr;
        console.log(lyr);

        setTimeout(() => {
          this.updateModal = false;
          this.addLayerHandler();
          this.completeModal = true;
        }, 500);
      });
    },
    // ? @圖層切換調整：新增圖層
    addLayerHandler () {
      // ! 新增圖層的功能是檔案上傳匯入的，這邊先做一個假的模擬
      // ! 要注意每個圖層要有獨立的 ID，若 API 沒提供就要自己生

      this.CONSOLE('【圖層調整】這邊需要讓使用者上傳圖層資料');

      const _layer = {
        fid: `layer_${this.GET_RESOURCE_ID()}`,
        title: this.fileName,
        type: 'addition',
        visible: true,
        opacity: 0,
        inUse: true,
        myLayerFile: this.myLayer
      };

      this.layerOptions.layerList.push(_layer);
    },
    // * @幾何圖形：開始繪圖
    startDrawing (payload) {
      // 使用者點選的圖形
      this.geometryOptions.current = payload;
      // 開啟測量
      this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { measure: true });

      if (this.geometryOptions.current === 'rectangleLand') {
        this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { mode: CSC.GISOverlayType.ENVELOPE, fillOptions: { fillColor: '#8D2683' } });
      } else if (this.geometryOptions.current === 'rect') {
        this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { mode: CSC.GISOverlayType.ENVELOPE, fillOptions: { fillColor: '#06E4AF' } });
      } else if (this.geometryOptions.current === 'polygonLand') {
        this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { mode: CSC.GISOverlayType.POLYGON, fillOptions: { fillColor: '#8D2683' } });
      } else if (this.geometryOptions.current === 'poly') {
        this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { mode: CSC.GISOverlayType.POLYGON, fillOptions: { fillColor: '#06E4AF' } });
      } else if (this.geometryOptions.current === 'circleLand') {
        this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { mode: CSC.GISOverlayType.CIRCLE, fillOptions: { fillColor: '#8D2683' } });
      } else if (this.geometryOptions.current === 'circle') {
        this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { mode: CSC.GISOverlayType.CIRCLE, fillOptions: { fillColor: '#06E4AF' } });
      } else if (this.geometryOptions.current === 'line') {
        this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { mode: CSC.GISOverlayType.LINESTRING, strokeOptions: { strokeWeight: 2 } });
      }
    },
    // * @幾何圖形：上一步
    backStepHandler () {
      this.gisMap.drawingMethod(CSC.DrawingMethod.Back);
    },
    // * @幾何圖形：取消
    cancelStepHandler () {
      this.gisMap.drawingMethod(CSC.DrawingMethod.Cancel);
      this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { mode: CSC.GISOverlayType.NONE });
    },
    // * @幾何圖形：編輯(鉛筆)
    modifyStepHandler (id) {
      const { graphList } = this.geometryOptions;
      const index = graphList.findIndex(item => item.id === id);
      // 找到要編輯的圖形
      const editme = this.myGraphs[index];
      // 啟用編輯圖形
      this.gisMap.drawingMethod(CSC.DrawingMethod.Modify, { overlay: editme });
      // 定位擴大的圖形範圍
      // this.gisMap.fitBounds(editme.getEnvelope(), 1.25);
      this.saveIndex = index;
    },
    // * @幾何圖形：按下預定地會定位至地圖
    getGeoItemPosition (id) {
      const { graphList } = this.geometryOptions;
      const index = graphList.findIndex(item => item.id === id);
      // 找到要定位的圖形
      const overlay = this.myGraphs[index];
      // 先把所有圖形顏色變預設
      this.myGraphs.forEach((item) => {
        if (item.type === 'rectangleLand' || item.type === 'circleLand' || item.type === 'polygonLand') {
          item.setFillColor('#8D2683');
        } else if (item.type === 'rect' || item.type === 'poly' || item.type === 'circle') {
          item.setFillColor('#06E4AF');
        }
      });
      // 要定位的那個圖形放大+變色
      this.gisMap.fitBounds(overlay.getEnvelope(), 1.25);
      if (overlay.type === 'rectangleLand' || overlay.type === 'circleLand' || overlay.type === 'polygonLand') {
        overlay.setFillColor('#FF7269');
      } else if (overlay.type === 'rect' || overlay.type === 'poly' || overlay.type === 'circle') {
        overlay.setFillColor('#FF03E7');
      }
    },
    // * @幾何圖形：幾何圖形類別
    geometryTypesProvider (nameList) {
      return this.geometryOptions.typeList.filter(item => nameList.includes(item.id));
    },
    // * @幾何圖形：篩選幾何圖形資料
    geometryGraphProvider (nameList) {
      return this.geometryOptions.graphList.filter(item => nameList.includes(item.type));
    },
    // * @幾何圖形：篩選幾何圖形資料(暫存的圖形)
    myGraphsProvider (nameList) {
      return this.myGraphs.filter(item => nameList.includes(item.type));
    },
    // * @幾何圖形：刪除幾何圖形資料
    deleteGeometryItemHandler (id) {
      const { graphList } = this.geometryOptions;
      const index = graphList.findIndex(item => item.id === id);
      this.$swal({
        icon: 'warning',
        width: 402,
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        title: '是否要刪除該圖形？',
        text: '確認後不可恢復！'
      }).then((result) => {
        if (result.value) {
          graphList.splice(index, 1);
          // 刪除暫存中的圖形
          this.gisMap.drawingMethod(CSC.DrawingMethod.Remove, { overlay: this.myGraphs.splice(index, 1)[0] });
        }
      });
    },
    // * @幾何圖形：刪除幾何圖形資料 (測量長度/面積)
    deleteGeometryItemHandler2 (id) {
      const { graphList } = this.geometryOptions;
      const index = graphList.findIndex(item => item.id === id);
      graphList.splice(index, 1);
      // 刪除暫存中的圖形
      this.gisMap.drawingMethod(CSC.DrawingMethod.Remove, { overlay: this.myGraphs.splice(index, 1)[0] });
    },
    // * @幾何圖形：刪除所有幾何圖形資料
    deleteAllGeometryItemHandler (nameList) {
      const { graphList } = this.geometryOptions;
      // clear,claer2 = graphList myGraphs 中去除目前自己所屬的type(新增預定or測量長度) 的資料後, 剩下的資料
      const clear = graphList.filter(item => !nameList.includes(item.type));
      const clear2 = this.myGraphs.filter(item => !nameList.includes(item.type));
      // killme = myGraphs中要刪除的資料
      const killme = this.myGraphs.filter(item => nameList.includes(item.type));
      this.$swal({
        icon: 'warning',
        width: 402,
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        title: '是否要刪除該圖形？',
        text: '確認後不可恢復！'
      }).then((result) => {
        if (result.value) {
          this.geometryOptions.graphList = clear;
          this.myGraphs = clear2;
          // 刪除地圖上的圖形
          killme.forEach((item) => {
            this.gisMap.drawingMethod(CSC.DrawingMethod.Remove, { overlay: item });
          });
          console.log(this.myGraphs);
          this.unSave = false;

          // -------
          this.frRows.length = 0;
          this.newEditRows.length = 0;
        }
      });
    },
    // * @幾何圖形：刪除所有幾何圖形資料 (測量長度/面積)
    deleteAllGeometryItemHandler2 (nameList) {
      const { graphList } = this.geometryOptions;
      // clear,claer2 = graphList myGraphs 中去除目前自己所屬的type(新增預定or測量長度) 的資料後, 剩下的資料
      const clear = graphList.filter(item => !nameList.includes(item.type));
      const clear2 = this.myGraphs.filter(item => !nameList.includes(item.type));
      // killme = myGraphs中要刪除的資料
      const killme = this.myGraphs.filter(item => nameList.includes(item.type));

      this.geometryOptions.graphList = clear;
      this.myGraphs = clear2;
      // 刪除地圖上的圖形
      killme.forEach((item) => {
        this.gisMap.drawingMethod(CSC.DrawingMethod.Remove, { overlay: item });
      });
      console.log(this.myGraphs);
      this.unSave = false;
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
        detail: this.totalArea[this.totalArea.length - 1],
        controlBar: false,
        radius: this.circleRadius[this.circleRadius.length - 1]
      };

      // * 在暫存圖形中新增type屬性 值為line/circle/circleland...等
      this.myGraphs[this.myGraphs.length - 1].type = current;
      // 新增圖形資料
      // amountCounter[category] += 1;
      this.myCounter += 1;
      graphList.push(result);
    },
    // * @幾何圖形：上傳幾何圖形資料
    uploadGraphHandler () {
      const count = this.myGraphs.length;
      const myGraphs = this.myGraphs;
      this.$swal({
        icon: 'question',
        width: 402,
        // html: `確認新增${count}筆建物預定用地申請<br />確認後將跳轉建物預定地簽核作業`,
        html: '編輯完成  確認後將返回ERP建物頁面',
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.value) {
          // 若按下確定

          const myName = this.geometryOptions.graphList.map(item => item.name);
          console.log(myName);

          const newArr = [];
          myGraphs.forEach((item, index) => {
            newArr.push({ building: { key: myName[index] }, geometry: item.toJson() });
          });

          const formData = new FormData();
          formData.append('userId', this.userId);
          formData.append('key', this.manageId);
          formData.append('points', `${JSON.stringify(newArr)}`);

          fetch('/csc2api/proxy?url=https://east.csc.com.tw/eas/mhb/rest/mhbe/UpdateBuildingPoints', {
            method: 'POST',
            // headers: new Headers({
            //   'Content-Type': 'multipart/form-data'
            // }),
            body: formData
          }).then((response) => {
            return response;
          }).then((data) => {
            // 若確定有儲存到ERP 才把傳到後端的key值賦值給取名陣列
            this.landId = myName;
            // 關閉視窗
            window.open('', '_self', '');
            window.close();
          }).catch((err) => {
            console.log('錯誤:', err);
          });

          this.myGraphs.length = 0;
          this.geometryOptions.graphList.length = 0;
          this.unSave = false;
        }
      });
    },
    // * @幾何圖形：取得幾何圖形圖層名稱
    geometryNameProvider (category) {
      if (this.landId.length > 0) {
        // 取到'00381-'
        const front = this.landId[this.landId.length - 1].substring(0, 6);
        // 取最後兩個字元+1
        const end = parseInt(this.landId[this.landId.length - 1].substring(6, 8), 10);
        this.setCount = end;
        const result = this.setCount + this.myCounter + 1;
        if (result < 10) {
          return `${front}0${result}`;
        } else {
          return `${front}${result}`;
        }
      }

      // 後端沒傳圖形過來
      if (this.landId.length === 0) {
        const result = this.myCounter + 1;
        if (result < 10) {
          return `${this.manageId}-0${result}`;
        } else {
          return `${this.manageId}-${result}`;
        }
      }
    },
    // ? @搜尋：建物搜尋與匯入方格圖
    searchHandler (payload) {
      this.$store.commit('CTRL_LOADING_MASK', true);
      if (payload.modeType === 'structure') {
        this.clearSearchResultHandler();
      }

      // ! 先用 setTimeout 做一個模擬 ajax 的樣子給人看
      setTimeout(() => {
        // 搜尋結果是建物or方格
        const MODE_TYPE = payload.modeType;
        this.searchResult.types = MODE_TYPE;
        // 所選擇的搜尋條件
        this.searchSelected.keyword = payload.keyword;
        this.searchSelected.status = payload.status;
        this.searchSelected.types = payload.types;

        // ! 這邊要用 call api 抓資料
        if (MODE_TYPE === 'structure') {
          this.getSearchResult();
        }

        if (MODE_TYPE === 'lattice') {
          const lattResult = {
            name: payload.keyword,
            id: new Date(),
            visible: true,
            opacity: 50
          };
          this.searchResult.list.lattice.push(lattResult);
        }

        // const result = require(`~/static/_resources/${MODE_TYPE}Result.json`);

        // this.searchResult.types = MODE_TYPE;
        // this.searchResult.list[MODE_TYPE] = [...result.data];
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
      if (this.nowMode === 'structure') {
        this.searchResult.list.structure = [];
        this.searchResult.currentBuilding = '';
      }

      if (this.nowMode === 'lattice') {
        this.searchResult.list.lattice = [];
      }
    },
    // * @搜尋：清除所有搜尋結果與輸入欄位
    clearSearchResultAndCondition () {
      this.clearSearchResultHandler();

      const _queryWindow = this.$refs.queryWindow;
      _queryWindow.clearAllHandler();
    },
    // * 選取建物項目，地圖移動至對應坐標
    focusBuildingHandler (payload) {
      this.searchResult.currentBuilding = payload.key;
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
    // * @方格圖：切換至方格 關閉球標、隱藏某些圖層
    openGridHandler () {
      this.hideClusterHandler();
      this.layerOptions.layerList.forEach((item) => {
        this.gisMap.setupLayer({ fid: item.fid, visible: false });
        item.visible = false;
        if (item.fid === 1 || item.fid === 11 || item.fid === 12) {
          this.gisMap.setupLayer({ fid: item.fid, visible: true });
          item.visible = true;
        }
      });
    },
    // * @方格圖：切換回建物 開啟球標、開啟目前的圖層預設
    hideGridHandler () {
      this.hideClusterHandler();
      this.getDefaultLayer();
      // 將圖層設定回復至預設
      setTimeout(() => {
        this.layerOptions.layerList.forEach((item) => {
          if (item.visible === true) {
            this.gisMap.setupLayer({ fid: item.fid, visible: true });
          } else if (item.visible === false) {
            this.gisMap.setupLayer({ fid: item.fid, visible: false });
          }
        });
      }, 200);
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

      // const result = !this.$store.state.mobileSelectUP;
      // this.$store.commit('SET_MOBILE_SELECT', result);
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
    },
    // * 圖北切換
    setOptionsHandler () {
      if (this.switchOptions === '') {
        this.switchOptions = 'MAP_N';
        this.switchBgColor = true;
      } else if (this.switchOptions === 'MAP_N') {
        this.switchOptions = 'CSC_N';
        this.switchBgColor = false;
      } else if (this.switchOptions === 'CSC_N') {
        this.switchOptions = 'MAP_N';
        this.switchBgColor = true;
      }
      this.gisMap.setOptions({ angle: this.switchOptions });
    },
    // * 取得建物類型資料 F3 API
    getStructureType () {
      fetch('/csc2api/proxy?url=https://east.csc.com.tw/eas/mhb/rest/mhbe/BuildingType?_format=json', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        // const newData = JSON.parse(data);
        const newObject = Object.entries(data)
          .map(([buildValue, buildName]) => {
            return { value: buildValue, name: buildName };
          });
        this.structureType = newObject;
        console.log(this.structureType);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 取得預設圖層API
    getDefaultLayer () {
      fetch('/cscmap2/api/layer', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        // 在撈回的data中新增屬性type 其值為local
        data.forEach((item, index, array) => {
          item.type = 'local';
          item.myLayerFile = '';
        });
        this.layerOptions.layerList = data;
        console.log(this.layerOptions.layerList);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 取得建物搜尋結果 F3 API
    getSearchResult () {
      fetch(`/csc2api/proxy?url=${encodeURIComponent(`https://east.csc.com.tw/eas/mhb/rest/mhbe/BuildingList?_format=json&Keyword=${this.searchSelected.keyword}&Status=${this.searchSelected.status}&Type=${this.searchSelected.types}`)}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
        // 依時間排序
        data.sort(function (a, b) {
          return a.applytime < b.applytime ? 1 : -1;
        });
        this.searchResult.list.structure = data;
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 桌機版 點擊單筆ERP看詳細
    singleErpDetail (payload) {
      window.open(`https://east.csc.com.tw/eas/mhb/platform/mhbbd?manageNo=${payload}`);
    },
    // * 桌機版 點擊多筆ERP看詳細
    allErpDetail () {
      const newArr = [];
      this.searchResult.list.structure.forEach((item) => {
        newArr.push(item.key);
      });
      const keyNumber = newArr.join(',');
      window.open(`https://east.csc.com.tw/eas/mhb/platform/mhbba?keys=${keyNumber}`);
    },
    sortTimeHandler (payload) {
      console.log(payload);
      if (payload === '時間由近到遠') {
        this.searchResult.list.structure.sort(function (a, b) {
          return a.applytime < b.applytime ? 1 : -1;
        });
      } else if (payload === '時間由遠到近') {
        this.searchResult.list.structure.sort(function (a, b) {
          return a.applytime > b.applytime ? 1 : -1;
        });
      }
    },
    // * 畫面擷取
    screenShotHandler () {
      this.screenShotModal = true;
      this.gisMap.layout((img) => {
        console.log(img.src);
        this.screenImgSrc = img.src;

        setTimeout(() => {
          document.getElementById('myShot').click();
          this.screenShotModal = false;
        }, 1000);
      });
    },
    getSingleCluster (mykey) {
      // 一期 f3 api 1
      // https://east.csc.com.tw/eas/mhb/rest/mhbe/getBuildingByKey/00004-01?_format=json
      const cluster = require('~/static/_resources/single.json');
      this.singleClusterInfo = cluster.data[0];
    },
    getMultiCluster (mykey) {
      // 一期 f3 api 3
      // https://east.csc.com.tw/eas/mhb/rest/mhbe/getBuildingByKey/00004-01,00004-02?_format=json
      const cluster = require('~/static/_resources/multi.json');
      this.multiClusterInfo = cluster.data;
    },
    addSymbo () {
      this.pGISSymbo = new CSC.GISSymbol();
      this.pGISSymbo.symbolStyle = CSC.GISSymbolStyle.CIRCLE;
      this.pGISSymbo.xPixel = 15;
      this.pGISSymbo.yPixel = 15;
      this.pGISSymbo.fillColor = '#4286f5'; // #0095EB
      this.pGISSymbo.fillOpacity = 1;
      this.pGISSymbo.strokeWeight = 3;
      this.pGISSymbo.strokeOpacity = 0.4;
      this.pGISSymbo.strokeColor = '#FFFFFF';
      this.pGISSymbo.anchor.x = 30;
      this.pGISSymbo.anchor.y = 30;
      this.pGISSymbo.rotation = 0;
    },

    scrollTopHandler (key) {
      const index = this.multiClusterInfo.findIndex(item => item.key === key);
      console.log(index);

      this.$nextTick(() => {
        const result = index < 1 ? 0 : (index * 35);
        this.$refs.mycontent.scrollTop = result;
        console.log(result);
      });
    },
    // * 鎖點測量: 線測量
    drawLineHandler () {
      this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { measure: true, mode: CSC.GISOverlayType.LINESTRING, strokeOptions: { strokeWeight: 2 } });

      // 取得地圖中心坐標資訊
      const coordinfo = this.gisMap.coordinateInfo(this.gisMap.getCenter());
      console.log(coordinfo);
      console.log(this.gisMap.gridInfo(coordinfo.GridNO));

      // 加入地圖中心至已啟用的繪圖操作
      this.gisMap.drawingMethod(CSC.DrawingMethod.Push, { point: this.gisMap.getCenter() });
    },
    finishHandler () {
      this.gisMap.drawingMethod(CSC.DrawingMethod.End);
      this.drawModeLine = false;
    },
    clearLineHandler () {
      const index = this.myGraphs.findIndex(item => item.type === 'line');
      console.log(index);
      this.gisMap.drawingMethod(CSC.DrawingMethod.Remove, { overlay: this.myGraphs.splice(index, 1)[0] });
      this.lineSum = 0;
      this.drawModeLine = true;
    },
    // * 鎖點測量: 面測量
    drawAreaHandler () {
      this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { measure: true, mode: CSC.GISOverlayType.POLYGON, fillOptions: { fillColor: '#06E4AF', strokeWeight: 2 } });
      const coordinfo = this.gisMap.coordinateInfo(this.gisMap.getCenter());
      this.gisMap.drawingMethod(CSC.DrawingMethod.Push, { point: this.gisMap.getCenter() });
    },
    finishHandler2 () {
      this.gisMap.drawingMethod(CSC.DrawingMethod.End);
      this.myGraphs.forEach((item) => {
        if (item.type === 'surface') {
          item.setFillColor('#06E4AF');
        }
      });
      this.drawModeArea = false;
    },
    clearAreaHandler () {
      const index = this.myGraphs.findIndex(item => item.type === 'surface');
      console.log(index);
      this.gisMap.drawingMethod(CSC.DrawingMethod.Remove, { overlay: this.myGraphs.splice(index, 1)[0] });
      this.areaSum = 0;
      this.drawModeArea = true;
    },
    measurerHandler () {
      // * 在暫存圖形中新增type屬性 值為point/line/surface...等
      this.myGraphs[this.myGraphs.length - 1].type = this.geometryMeasurer.current;
    },
    // * 關閉 手機版 測量點線面視窗
    closeMeasurePopupBox () {
      this.activeWindow = '';
      this.mobPoint.destroy();
      // this.measurePointBox = false;
      this.gisMap.drawingMethod(CSC.DrawingMethod.Clear);
      this.pointMeasurer.current = 'cscXy';
      this.haveUploaded = false;
      this.lineSum = 0;
      this.areaSum = 0;
      this.drawModeLine = true;
      this.drawModeArea = true;
      this.pointCscNo = '';
      this.pointCscXy.x = '';
      this.pointCscXy.y = '';
      this.pointTwdXy.x = '';
      this.pointTwdXy.y = '';
      this.pointColdXy.x = '';
      this.pointColdXy.y = '';
    },
    // * 返回所有測量視窗 & 重繪
    backAllMeasure () {
      this.mobPoint.destroy();
      // this.measurePointBox = false;
      this.activeWindow = 'measureWindow';
      this.pointMeasurer.current = 'cscXy';
      this.haveUploaded = false;
      this.pointCscNo = '';
      this.pointCscXy.x = '';
      this.pointCscXy.y = '';
      this.pointTwdXy.x = '';
      this.pointTwdXy.y = '';
      this.pointColdXy.x = '';
      this.pointColdXy.y = '';
    },
    okHandler () {
      this.gisWarnModal = true;
    },
    // * 鎖點測量: 點測量 (按下確認視窗中的確定後)
    drawPointHandler () {
      this.gisMap.drawingMethod(CSC.DrawingMethod.Draw, { measure: true });
      // 定位+畫圖
      const mypo = this.gisMap.coordinateInfo(this.gisMap.getCenter());
      const position = new CSC.GISPoint(mypo.CSC.x, mypo.CSC.y);

      const imgUrl = require('~/assets/img/cir-po.svg');
      this.mobPoint = new CSC.GISMarker(this.gisMap, this.gisMap.getCenter(), null, new CSC.GISImage(imgUrl, new CSC.GISSize(20, 20), this.gisMap.getCenter(), new CSC.GISPoint(10, 10)));

      // 寫入坐標資料
      this.mobPoint.setFlat(true);
      this.pointCscNo = mypo.GridNO;
      this.pointCscXy.x = mypo.CSC.x;
      this.pointCscXy.y = mypo.CSC.y;
      this.pointTwdXy.x = mypo.TWD97.x;
      this.pointTwdXy.y = mypo.TWD97.y;
      if (typeof mypo.CRM !== 'undefined') {
        this.pointColdXy.x = mypo.CRM.x;
        this.pointColdXy.y = mypo.CRM.y;
      }

      this.gisWarnModal = false;
      // this.activeWindow = '';
      // this.measurePointBox = true;
      this.activeWindow = 'mobileMeasureWindow';
    },
    dxfUpload () {
      this.haveUploaded = true;
      fetch('/cscmap2/api/DXFLoader', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(`GridNOs[0]: ${this.pointCscNo}`)
      }).then((response) => {
        return response;
      }).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    copyCoord (id) {
      const str = document.getElementById(id);
      window.getSelection().selectAllChildren(str);
      document.execCommand('copy');
      if (this.pointMeasurer.current === 'cscNo' && this.pointCscNo === 'undefined') {
        this.copyOkModal = false;
      } else {
        this.copyOkModal = true;
      }

      setTimeout(() => {
        this.copyOkModal = false;
      }, 600);
    }
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

      if (value === 'mobileMeasureWindow' && this.screenWidth < 1024) {
        this.pointMeasurer.aimpoint = true;
      } else {
        this.pointMeasurer.aimpoint = false;
      }
    },
    markerVisible (value) {
      if (value === false) {
        this.addClusterBg = true;
      } else {
        this.addClusterBg = false;
      }
    },
    // measurePointBox (value) {
    //   if (value === true) {
    //     this.pointMeasurer.aimpoint = true;
    //   } else {
    //     this.pointMeasurer.aimpoint = false;
    //   }
    // },
    // * 這邊用 watch 監聽資料的變化，也可以改用別種方式來做
    'geometryOptions.current' (value) {
      if (value !== '') {
        this.CONSOLE(`【幾何圖形】呼叫 createGeometryItemHandler() 就可以新增 ${value} 圖形`);
      }
    },
    // * 新增預定用地: 資料編號
    'geometryOptions.graphList' (value) {
      if (this.landId.length > 0) {
        // 取到'00381-'
        const front = this.landId[this.landId.length - 1].substring(0, 6);
        // 取最後兩個字元
        const end = parseInt(this.landId[this.landId.length - 1].substring(6, 8), 10);

        this.frRows = this.geometryOptions.graphList.filter(item => parseInt(item.name.substring(6, 8), 10) <= end);

        this.newEditRows = this.geometryOptions.graphList.filter(item => parseInt(item.name.substring(6, 8), 10) > end);

        this.newEditRows.forEach((item, index) => {
          const newNos = end + index + 1;
          if (newNos < 10) {
            item.name = `${front}0${newNos}`;
          } else {
            item.name = `${front}${newNos}`;
          }
        });
      }

      //* 後端沒傳圖形過來
      if (this.landId.length === 0) {
        this.geometryOptions.graphList.forEach((item, index) => {
          const newNos = index + 1;
          if (newNos < 10) {
            item.name = `${this.manageId}-0${newNos}`;
          } else {
            item.name = `${this.manageId}-${newNos}`;
          }
        });
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

// table.layersTable tr td:nth-child(2) {
//   width: 60px !important;
// }

// table.layersTable tr td:nth-child(1) {
//   width: 60px !important;
// }

.dxf-bg {
  height: 30px;
  background: url('~/assets/img/icon/white-upload.svg') no-repeat center center/contain !important;
}

.dxf-fo {
  color: rgba(64, 139, 197, 0.5) !important;
}

.ww5 {
  p {
    margin-bottom: -8px;
    margin-top: 20px;
  }
}

.copyok {
  width: 46px;
  height: 46px;
  background: url('~/assets/img/icon/copy-ok.svg') no-repeat center center/contain;
}

.vv1 {
  padding: 17px 0 6px !important;
}

.ww1 {
  width: 345px !important;
  height: 200px !important;

  p {
    margin-bottom: 0;
  }
}

.ww2 {
  margin-top: 20px;
}

.ww3 {
  width: 108px;
}

.clone-container {
  margin-top: 12px;
  display: flex;
  justify-content: space-evenly;
}

.clone-name1 {
  color: #408bc5;
}

.clone-name2 {
  color: #408bc5;
}

.clone-name3 {
  color: #d37672;
}

.clone-pic1 {
  height: 31px;
  background: url('~/assets/img/icon/clone1.svg') no-repeat center center/contain;
}

.clone-pic2 {
  height: 30px;
  background: url('~/assets/img/icon/clone2.svg') no-repeat center center/contain;
}

.clone-pic3 {
  height: 30px;
  background: url('~/assets/img/icon/clone3.svg') no-repeat center center/contain;
}

.mea-mob {
  text-align: center !important;
}

.go-margi {
  margin-bottom: -10px !important;
}

.triangle {
  width: 37.5px;
  height: 37px;
  position: absolute;
  bottom: -25px;
  left: 5px;
  background: url('~/assets/img/icon/triangle-icon.svg') no-repeat center/contain;
}

.close-icon {
  width: 11px;
  height: 11px;
  position: absolute;
  top: 8px;
  right: 10px;
  background: url('~/assets/img/icon/map-closebutton.svg') no-repeat center/contain;
}

.modal_wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 9998;
  cursor: default;
}

.modal {
  width: 430px;
  padding: 30px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  z-index: 9999;
  transform: translate(-50%, -50%);
  flex-direction: column;
}

.close-modal {
  width: 35px;
  height: 35px;
  position: absolute;
  top: 8px;
  right: 10px;
  background: url('~/assets/img/icon/close_icon.svg') no-repeat center/contain;
  cursor: pointer;
}

.p1 {
  margin-top: 39px;
  font-size: 18px;
  margin-bottom: 7px;
}

.p2 {
  font-size: 18px;
  color: red;
}

.file-button {
  width: 118px;
  padding: 10px 6px;
  margin: 26px 0 18px;
  font-size: 16px;
  color: #fff;
  background-color: #408bc5;
  border-radius: 10px;
  cursor: pointer;
}

.file-button-cancel {
  width: 118px;
  padding: 10px 6px;
  margin: 26px 0 18px;
  font-size: 16px;
  color: #454141;
  background-color: #fff;
  border: 1px solid #d0d0d0;
  border-radius: 10px;
  cursor: pointer;
}

.title-img {
  padding: 5px;
  display: flex;
  justify-content: space-evenly;
  color: #408bc5;
  background-color: #e4f4ff;
  border-radius: 10px;
}

.title-img2 {
  width: 24px;
  height: 24px;
  margin-right: 6px;
  background: url('~/assets/img/icon/save-icon.svg') no-repeat center/contain;
}

.title-img3 {
  font-size: 17px;
  font-weight: 600;
}

.p3 {
  margin-top: 42px;
  font-size: 25px;
  font-weight: bold;
  color: #165f88;
}

.screen-modal {
  margin-top: 23px;
}

.bar {
  width: 236px;
  height: 12px;
  margin: 10px 0 20px;
  background: url('~/assets/img/icon/bar-new.svg') no-repeat center/contain;
}

.okpic {
  width: 25px;
  height: 25px;
  background: url('~/assets/img/icon/ok-buttton.svg') no-repeat center/contain;
}

.forbidden {
  width: 38px;
  height: 34.6px;
  margin: 10px 0;
  background: url('~/assets/img/icon/forbid.svg') no-repeat center/contain;
}

.flex-group {
  width: 250px;
  display: flex;
  justify-content: space-between;
}

.add8 {
  margin-bottom: 5px;
}

.more-height {
  height: 83px;
}

.app {
  width: 100%;
  height: calc(100% - 60px) !important;
  // height: 100%;
  position: relative !important;
  overflow: hidden;
  background-color: $color-black;
  z-index: 0;
}

.hide-mee {
  height: 100% !important;
  position: absolute !important;
  top: 0;
  left: 0;
}

#CSCMap {
  width: 100%;
  height: 100%;
  // position: absolute;
  // top: 60px;
  // left: 0;
  overflow: hidden;
  z-index: 0;

  // iframe {
  //   width: 100%;
  //   height: 100%;
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   outline: none;
  // }
}

// * 手機版測量工具的準心

.aimpoint {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  // top: 5px;
  // left: 5px;
  background: url('~/assets/img/aimpoint.png') no-repeat center/55%;
  z-index: 4000;
  pointer-events: none;
}

// * 右下角的目前坐標資訊

.coordinates {
  width: 300px;
  min-height: 60px;
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

.co_cube2 {
  position: absolute;
  top: 30px;
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

.twd_push {
  top: 52px;
}

// * 圖層工具的表格

.layersTable {
  th,
  td {
    // width: 115px;

    &:first-child {
      // width: auto;
    }

    &:nth-child(1) {
      max-width: 81px !important;
    }

    &:nth-child(2) {
      max-width: 60px;
    }

    &:nth-child(3) {
      max-width: 69px !important;
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
  word-wrap: break-word;
}

.layersTable__row {
  display: table-row;
}

.layersTable__wrapper {
  width: 100%;
  // max-height: 360px;
  overflow-x: hidden;
  overflow-y: auto;
}

@import '~/assets/scss/components/_navtabs.scss';

</style>

<style lang="scss">
@import '~/assets/scss/components/_buildingItem.scss';
@import '~/assets/scss/components/_infowindow.scss';
</style>
