<template>
  <section>
    <h2>系统用户管理</h2>
    <!-- <a-divider /> -->
    <a-button type="primary" shape="round" @click="showModal">
      <template #icon>
        <plus-circle-two-tone />
      </template>
      新增管理员
    </a-button>

    <!-- 新增管理员模态框 -->
    <a-modal
      v-model:visible="visible"
      title="新增管理员"
      @ok="handleOk"
      okText="确定"
      cancelText="取消"
    >
      <!-- 注册表单 -->
      <a-form
        :model="formState"
        layout="horizontal"
        name="normal_login"
        class="login-form"
      >
        <!-- 账号框 -->
        <a-form-item
          name="account"
          :rules="[{ required: true, message: '请输入账号' }]"
          label="账号:"
        >
          <a-input
            v-model:value="formState.account"
            size="large"
            placeholder="新增账号"
          >
          </a-input>
        </a-form-item>

        <!-- 密码框 -->
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
          label="密码:"
        >
          <a-input
            v-model:value="formState.password"
            size="large"
            placeholder="新增密码"
          >
          </a-input>
        </a-form-item>
        <!-- 选择权限框 -->
        <a-form-item
          name="select"
          label="权限"
          :rules="[{ required: true, message: 'Please select your country!' }]"
        >
          <a-select
            v-model:value="formState.select"
            placeholder="请选择管理员权限"
          >
            <a-select-option value="0">系统管理员</a-select-option>
            <a-select-option value="1">基本管理员</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-divider />

    <a-table :columns="columns" :data-source="dataSource" bordered>
      <template #bodyCell="{ column, text, record }">
        <template v-if="['account', 'password'].includes(column.dataIndex)">
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

        <!-- 编辑权限单元格 -->
        <template v-if="column.dataIndex === 'status'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <a-select
                ref="select"
                v-model:value="editableData[record.key].status"
                placeholder="请选择管理员类型"
              >
                <a-select-option value="0">系统管理员</a-select-option>
                <a-select-option value="1">基本管理员</a-select-option>
              </a-select>
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ text == "0" ? "系统管理员" : "基本管理员" }}
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

const columns = [
  {
    title: "账号",
    dataIndex: "account",
    width: "30%",
    key: "account",
  },
  {
    title: "密码",
    dataIndex: "password",
    width: "30%",
    key: "password",
  },
  {
    title: "权限",
    dataIndex: "status",
    width: "20%",
    key: "status",
  },
  {
    title: "操作",
    dataIndex: "operation",
  },
];

export default defineComponent({
  name: "usersListView",
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

    // 获取权限管理人员data

    const getList = async () => {
      let res = await request.get("/api/routeUsers/getList");

      dataSource.splice(0);
      res.data.dataList.forEach((element) => {
        dataSource.push({
          key: element._id,
          account: element.account,
          password: element.password,
          status: element.status,
        });
      });
    };

    // 编辑功能
    const edit = (key) => {
      console.log(key);
      editableData[key] = cloneDeep(
        dataSource.filter((item) => key === item.key)[0]
      );
      // console.log(rec);
      console.log(editableData[key]);
    };

    // 保存功能
    const save = async (key) => {
      const resData = await request.post(
        "/api/routeUsers/updateRouteUser",
        editableData[key]
      );
      if (resData.status == 200 && resData.data.err_code == 0) {
        message.success(resData.data.message);
      }
      Object.assign(
        dataSource.filter((item) => key === item.key)[0],
        editableData[key]
      );
      delete editableData[key];
    };

    // 取消保存
    const cancel = (key) => {
      delete editableData[key];
    };

    // 删除功能
    const deleteData = async (key) => {
      const resData = await request.post("/api/routeUsers/deleteRouteUser", {
        _id: key,
      });
      if (resData.status == 200 && resData.data.err_code == 0) {
        message.success(resData.data.message);
        getList();
      }
      delete editableData[key];
    };
    // 打开模态框
    const showModal = () => {
      visible.value = true;
    };
    //新增管理员
    const handleOk = async (e) => {
      const reqData = {
        account: formState.account,
        password: formState.password,
        status: formState.select,
      };
      const res = await request.post("/api/routeUsers/addRouteUser", reqData);

      if (res.status == 200 && res.data.err_code == 0) {
        message.success(res.data.message);
        visible.value = false;
        formState.account = "";
        formState.password = "";
        formState.select = "0";
        getList();
      } else {
        message.error("添加失败");
      }
      // console.log(res);
      // visible.value = false;
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
      visible,
      handleOk,
      showModal,
      formState,
    };
  },
});
</script>

<style lang="less">
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
