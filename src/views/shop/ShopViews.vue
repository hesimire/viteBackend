<template>
  <section>
    <h2>商品管理</h2>
    <!-- <a-divider /> -->
    <!-- <a-button type="primary" shape="round" @click="toAddShops">
      <template #icon>
        <plus-circle-two-tone />
      </template>
      新增商品
    </a-button> -->

    <a-divider />

    <!-- dataSource.push({
          key: element._id,
          imgUrl:element.imgUrl,
          name: element.name,
          newPrice: element.newPrice,
          isHot: element.isHot,
        }); -->

    <a-table :columns="columns" :data-source="dataSource" bordered>
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'imgUrl'">
          <div class="tableImg">
            <a-image :src="text" />
          </div>
        </template>

        <template v-if="['name'].includes(column.dataIndex)">
          <div>
            <a-input
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][column.dataIndex]"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-if="column.dataIndex === 'info'">
          <div>
            <a-textarea
              :rows="4"
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][column.dataIndex]"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-if="['newPrice', 'oldPrice'].includes(column.dataIndex)">
          <div>
            <a-input
              prefix="￥"
              suffix="RMB"
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][column.dataIndex]"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>

        <!-- 编辑热门单元格 -->
        <template v-if="column.dataIndex === 'isHot'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <a-select
                ref="select"
                v-model:value="editableData[record.key].isHot"
                placeholder="是否热门商品"
                style="width: 100px"
              >
                <a-select-option :value="0">非热门</a-select-option>
                <a-select-option :value="1">热门</a-select-option>
              </a-select>
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ text == "0" ? "非热门" : "热门" }}
            </div>
          </div>
        </template>
        <!-- 编辑商品种类单元格 -->
        <template v-if="column.dataIndex === 'cClass'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <a-select
                ref="select"
                v-model:value="editableData[record.key].class"
                placeholder="商品种类"
                style="width: 100px"
              >
                <a-select-option value="computer">电脑</a-select-option>
                <a-select-option value="sweep">扫地机器人</a-select-option>
                <a-select-option value="phone">手机</a-select-option>
                <a-select-option value="pot">电饭锅</a-select-option>
                <a-select-option value="TV">电视</a-select-option>
                <a-select-option value="watch">智能手表</a-select-option>
              </a-select>
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ text }}
            </div>
          </div>
        </template>
        <!-- 操作单元格 -->
        <template v-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a-typography-link @click="save(record.key)"
                >保存</a-typography-link
              >
              |
              <!-- <a-popconfirm
                title="Sure to cancel?"
                @confirm="cancel(record.key)"
              >
                <a>取消</a>
              </a-popconfirm> -->
              <a @click="cancel(record.key)">取消</a>
            </span>
            <span v-else>
              <a @click="edit(record.key)">编辑</a> |
              <a @click="deleteData(record.key)">删除</a>
            </span>
          </div>
        </template>
      </template>
    </a-table>
  </section>
</template>

<script>
import request from "@/api/index.js";
import { cloneDeep } from "lodash-es";
import { defineComponent, reactive, ref, onMounted } from "vue";
import { userType, returnRouteType } from "../../utils/type";
import {
  CheckOutlined,
  EditOutlined,
  DownloadOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css";
import { useRouter } from "vue-router";

//  "name": "小米电脑PLUS",
//   "newPrice": 1700,
//   "oldPrice": 1900,
//   "class": "computer",
//   "cClass": "电脑",
//   "imgUrl": "http://192.168.1.4:3001/images/computer1.webp",
//   "info": "第11代智能英特尔酷睿i5-1135G7/Windows 11 家庭中文版/16G/512GB SSD/英特尔锐钜Xe显卡/14英寸FHD 广视角 LED背光显示屏 100% sRGB 色域/银色 笔记本电脑",
//   "isHot": 1
const columns = [
  {
    title: "商品图片",
    dataIndex: "imgUrl",
    width: "10%",
    key: "imgUrl",
  },
  {
    title: "商品名",
    dataIndex: "name",
    width: "13%",
    key: "name",
  },
  {
    title: "商品种类",
    dataIndex: "cClass",
    width: "10%",
    key: "cClass",
  },
  {
    title: "商品信息",
    dataIndex: "info",
    width: "20%",
    key: "info",
  },
  {
    title: "现价格",
    dataIndex: "newPrice",
    width: "10%",
    key: "newPrice",
  },
  {
    title: "原价格",
    dataIndex: "oldPrice",
    width: "10%",
    key: "oldPrice",
  },
  {
    title: "是否热门",
    dataIndex: "isHot",
    width: "13%",
    key: "isHot",
  },
  {
    title: "操作",
    dataIndex: "operation",
  },
];

export default defineComponent({
  name: "shops",
  components: {
    CheckOutlined,
    EditOutlined,
    DownloadOutlined,
    PlusCircleTwoTone,
  },
  setup() {
    const formState = reactive({
      account: "",
      password: "",
      select: "0",
    });
    const visible = ref(false);
    const editableData = reactive({});
    const dataSource = reactive([]);
    const router = useRouter();

    // 获取列表

    const getList = async () => {
      let res = await request.get("/api/shops/ViteShopsList");

      console.log(res);
      dataSource.splice(0);
      res.data.dataList.forEach((element) => {
        dataSource.push({
          key: element._id,
          name: element.name,
          imgUrl: element.imgUrl,
          newPrice: element.newPrice,
          cClass: element.cClass,
          isHot: element.isHot,
          info: element.info,
          oldPrice: element.oldPrice,
          class: element.class,
        });
      });
    };

    // 编辑功能
    const edit = (key) => {
      console.log(key);
      editableData[key] = cloneDeep(
        dataSource.filter((item) => key === item.key)[0]
      );
      console.log(editableData[key]);
    };

    // 保存功能
    const save = async (key) => {
      console.log(editableData[key]);

      const resData = await request.patch(
        "/api/shops/updateShop",
        editableData[key]
      );

      console.log(resData);
      if (resData.status == 200 && resData.data.err_code == 0) {
        message.success(resData.data.message);
        Object.assign(
          dataSource.filter((item) => key === item.key)[0],
          editableData[key]
        );
      } else {
        message.error(resData.data.message);
      }

      delete editableData[key];
    };

    // 取消保存
    const cancel = (key) => {
      delete editableData[key];
    };

    // 删除功能
    const deleteData = async (key) => {
      const resData = await request.post("/api/shops/deleteShops", {
        _id: key,
      });

      if (resData.status == 200 && resData.data.err_code == 0) {
        message.success(resData.data.message);
        // getList();
        const Index = dataSource.findIndex((item) => key === item.key);
        dataSource.splice(Index, 1);
      } else {
        message.error(resData.data.message);
      }
    };
   
    //新增商品
    const toAddShops = () => {
      console.log(1);
       router.push({
         path:'/home/shops/addShop'
       }) 
    };

    onMounted(() => {
      getList();
    });

    return {
      dataSource,
      columns,
      editingKey: "",
      editableData,
      edit,
      save,
      cancel,
      deleteData,
      formState,
      toAddShops,
    };
  },
});
</script>

<style lang="less">
.tableImg {
  img {
    width: 150px;
    height: 120px;
  }
}

.editable-cell-text-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.editable-cell-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}
.editable-row-operations {
  user-select: none;
}
</style>
