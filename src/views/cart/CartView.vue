<template>
  <h2>订单管理</h2>
  <a-divider />

  <!-- 表格 -->
  <a-table
    :columns="columns"
    :data-source="CartsListDateSource"
    class="components-table-demo-nested"
    :expandedRowKeys="expandedRowKeys"
    @expand="expand"
  >
    <template #bodyCell="{ column, text, index, record }">
      <template v-if="column.key === 'cartsShopsTotalPrice'">
        <span> ￥{{ text }} </span>
      </template>

      <template v-if="column.key === 'status'">
        <div class="editable-cell">
          <div
            v-if="editableData[record.key]"
            class="editable-cell-input-wrapper"
          >
            <a-select
              ref="select"
              v-model:value="editableData[record.key].status"
              placeholder="请选择订单状态"
              style="width: 100px"
            >
              <a-select-option :value="1">未发货</a-select-option>
              <a-select-option :value="2">已发货</a-select-option>
              <a-select-option :value="3">已收货</a-select-option>
            </a-select>
          </div>
          <div v-else class="editable-cell-text-wrapper">
            <span v-if="text == '1'">未发货</span>
            <span v-else-if="text == '2'">已发货</span>
            <span v-else="text == '3'">已收货</span>
          </div>
        </div>

        <!-- <span>{{ text}}</span> -->
      </template>

      <template v-if="column.key === 'operation'">
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

    <template #expandedRowRender="{ record, index, indent, expanded }">
      <a-table
        :columns="innerColumns"
        :data-source="childrenDataList"
        :pagination="false"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.key === 'state'">
            <span>
              <a-badge status="success" />
              Finished
            </span>
          </template>

          <template v-if="column.key === 'imgUrl'">
            <div class="tableImg">
              <a-image :src="text" />
            </div>
          </template>
        </template>
      </a-table>
    </template>
  </a-table>
</template>
<script>
import { DownOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
import request from "../../api";
const columns = [
  {
    title: "订单号",
    dataIndex: "cartsNum",
    key: "cartsNum",
  },
  {
    title: "订单商品总量",
    dataIndex: "cartsShopsTotalNum",
    key: "cartsShopsTotalNum",
  },
  {
    title: "订单价格",
    dataIndex: "cartsShopsTotalPrice",
    key: "cartsShopsTotalPrice",
  },
  {
    title: "订单状态",
    dataIndex: "status",
    width: "20%",
    key: "status",
  },
  {
    title: "订单操作",
    key: "operation",
  },
];
const innerColumns = [
  {
    title: "商品图片",
    dataIndex: "imgUrl",
    key: "imgUrl",
  },
  {
    title: "商品名称",
    dataIndex: "name",
    key: "name",
  },
  {
    dataIndex: "totalNum",
    title: "商品数量",
    key: "totalNum",
  },
  {
    title: "商品单价",
    dataIndex: "totalPrice",
    key: "totalPrice",
  },
];
export default defineComponent({
  components: {
    DownOutlined,
  },

  setup() {
    const CartsListDateSource = reactive([]);
    const childrenDataList = reactive([]);

    const expandedRowKeys = reactive([]);

    const editableData = reactive([]);

    const getList = async () => {
      let res = await request.get("/api/carts/getAllCartsList");
      CartsListDateSource.splice(0);
      res.data.dataArr.forEach((element) => {
        CartsListDateSource.push({
          key: element._id,
          cartsNum: element._id,
          cartsShopsTotalNum: element.carts.totalNum,
          cartsShopsTotalPrice: element.carts.totalPrice,
          status: element.status,
          carts: element.carts,
          userId:element.userId
        });
      });
    };

    const expand = (expanded, record) => {
      console.log(expanded, record);

      if (expanded == true) {
        childrenDataList.splice(0);
        record?.carts?.shops.forEach((element, index) => {
          childrenDataList.push({
            key: element._id,
            imgUrl: element.imgUrl,
            name: element.name,
            totalNum: element.totalNum,
            totalPrice: element.totalPrice,
          });
        });
        expandedRowKeys.splice(0);
        expandedRowKeys.push(record.key);
      } else {
        expandedRowKeys.splice(0);
        childrenDataList.splice(0);
      }
    };

    const expandedRowsChange = (expandedRows) => {
      console.log("expandedRows:", expandedRows);
    };

    // 编辑功能
    const edit = (key) => {
      // console.log(key);
      editableData[key] = cloneDeep(
        CartsListDateSource.filter((item) => key === item.key)[0]
      );
      // console.log(editableData[key]);
    };

    // 保存功能
    const save = async (key) => {
      console.log(editableData[key]);

      const resData = await request.patch(
        "/api/carts/changeCartsStatus",
        editableData[key]
      );

      console.log(resData);
      if (resData.status == 200 && resData.data.err_code == 0) {
        message.success(resData.data.message);
        Object.assign(
          CartsListDateSource.filter((item) => key === item.key)[0],
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

      console.log(key);

      const resData = await request.delete("/api/carts/removeCarts?_id="+ key);
      
      if (resData.status == 200 && resData.data.err_code == 0) {
        message.success(resData.data.message);
        // getList();
        const Index = CartsListDateSource.findIndex((item) => key === item.key);
        CartsListDateSource.splice(Index, 1);
      } else {
        message.error(resData.data.message);
      }
    };

    onMounted(() => {
      getList();
    });

    return {
      columns,
      innerColumns,
      CartsListDateSource,
      childrenDataList,
      expand,
      expandedRowsChange,
      expandedRowKeys,
      editableData,
      edit,
      deleteData,
      save,
      cancel
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
</style>
