<template>
  <section>
    <h2>用户管理</h2>
    <!-- <a-divider /> -->
    <a-button type="primary" shape="round" @click="showModal">
      <template #icon>
        <plus-circle-two-tone />
      </template>
      新增消费者用户
    </a-button>

    <!-- 新增用户模态框 -->
    <a-modal
      v-model:visible="visible"
      title="新增用户"
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
          label="账   号:"
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
          label="密   码:"
        >
          <a-input
            v-model:value="formState.password"
            size="large"
            placeholder="新增密码"
          >
          </a-input>
        </a-form-item>
        <!-- 用户名框 -->
        <a-form-item
          name="nickName"
          :rules="[{ required: true, message: '请输入用户名' }]"
          label="用户名:"
        >
          <a-input
            v-model:value="formState.nickName"
            size="large"
            placeholder="新增用户名"
          >
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-divider />

    <a-table :columns="columns" :data-source="dataSource" bordered>
      <template #bodyCell="{ column, text, record }">
        <template
          v-if="['account', 'password', 'nickName'].includes(column.dataIndex)"
        >
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
    title: "用户名",
    dataIndex: "nickName",
    width: "20%",
    key: "nickName",
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
      nickName: "",
    });
    const visible = ref(false);
    const editableData = reactive({});
    const dataSource = reactive([]);

    // 获取用户List
    const getList = async () => {
      let res = await request.get("/api/routeUsers/getUserList");
      dataSource.splice(0);
      res.data.dataList.forEach((element) => {
        dataSource.push({
          key: element._id,
          account: element.account,
          password: element.password,
          nickName: element.nickName,
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
        "/api/routeUsers/updateUser",
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
      const resData = await request.post("/api/routeUsers/deleteUser", {
        _id: key,
      });
      if (resData.status == 200 && resData.data.err_code == 0) {
        message.success(resData.data.message);
        const Index = dataSource.findIndex((item) => key === item.key);
        dataSource.splice(Index, 1);
      } else {
        message.error(resData.data.message);
      }
      // delete editableData[key];
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
        nickName: formState.nickName,
      };
      const res = await request.post("/api/routeUsers/addUser", reqData);

      if (res.status == 200 && res.data.err_code == 0) {
        message.success(res.data.message);
        const ListItem = {
          key: res.data.ID,
          account: formState.account,
          password: formState.password,
          nickName: formState.nickName,
        };
        dataSource.push(ListItem);
        formState.account = "";
        formState.password = "";
        formState.select = "";
        visible.value = false;
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
label{
  width: 70px;
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
