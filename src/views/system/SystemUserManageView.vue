<script>
import request from "@/api/index.js";
import { cloneDeep } from "lodash-es";
import { defineComponent, reactive, ref } from "vue";

async function getData() {
  const data = await request.get("/api/routeUsers/getList");
  console.log(data);
}

const columns = [
  {
    title: "账号",
    dataIndex: "name",
    width: "30%",
  },
  {
    title: "密码",
    dataIndex: "age",
    width: "30%",
  },
  {
    title: "权限",
    dataIndex: "address",
    width: "20%",
  },
  {
    title: "operation",
    dataIndex: "operation",
  },
];
const data = [];

for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

export default defineComponent({
  name: "usersListView",
  setup() {
    const dataSource = ref(data);
    const editableData = reactive({});
    console.log(1);

    getData();
    
    const edit = (key) => {
      editableData[key] = cloneDeep(
        dataSource.value.filter((item) => key === item.key)[0]
      );
    };

    const save = (key) => {
      Object.assign(
        dataSource.value.filter((item) => key === item.key)[0],
        editableData[key]
      );
      delete editableData[key];
    };

    const cancel = (key) => {
      delete editableData[key];
    };

    return {
      dataSource,
      columns,
      editingKey: "",
      editableData,
      edit,
      save,
      cancel,
    };
  },
});
</script>

<template>
  <section>
    <h2>系统用户管理</h2>
    <a-table :columns="columns" :data-source="dataSource" bordered>
      <template #bodyCell="{ column, text, record }">
        <template v-if="['name', 'age', 'address'].includes(column.dataIndex)">
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
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a-typography-link @click="save(record.key)"
                >Save</a-typography-link
              >
              <a-popconfirm
                title="Sure to cancel?"
                @confirm="cancel(record.key)"
              >
                <a>Cancel</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="edit(record.key)">编辑</a> |
              <a @click="edit(record.key)">删除</a>
            </span>
          </div>
        </template>
      </template>
    </a-table>
  </section>
</template>

<style lang="less"></style>
