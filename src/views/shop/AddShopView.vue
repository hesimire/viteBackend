<template>
  <h2>添加商品</h2>
  <a-divider />
  <!-- <img src="http://192.168.1.4:3001/1655849929814.png" alt=""> -->
  <a-form
    ref="formRef"
    name="custom-validation"
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
    @validate="handleValidate"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item has-feedback label="商品名称" name="name">
      <a-input v-model:value="formState.name" type="text" autocomplete="off" />
    </a-form-item>
    <a-form-item has-feedback label="商品价格" name="newPrice">
      <a-input
        v-model:value="formState.newPrice"
        type="number"
        autocomplete="off"
        prefix="￥"
      />
    </a-form-item>
    <a-form-item
      has-feedback
      label="商品种类"
      name="class"
      :rules="[{ required: true, message: '请选择商品种类' }]"
    >
      <a-select v-model:value="formState.class" placeholder="请选择商品种类">
        <a-select-option value="computer">电脑</a-select-option>
        <a-select-option value="sweep">扫地机器人</a-select-option>
        <a-select-option value="phone">手机</a-select-option>
        <a-select-option value="pot">电饭锅</a-select-option>
        <a-select-option value="TV">电视</a-select-option>
        <a-select-option value="watch">智能手表</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item has-feedback label="商品信息" hasFeedback name="info">
      <a-textarea placeholder="请输入商品信息" v-model:value="formState.info">
      </a-textarea>
    </a-form-item>
    <a-form-item has-feedback label="商品图片">
      <a-upload
        accept="image/*"
        v-model:file-list="fileList"
        name="file"
        action="/api/upload/img"
        :headers="headers"
        :progress="progress"
        :maxCount="1"
        list-type="picture"
        :beforeUpload="beforeUpload"
        :customRequest="upLoadImg"
      >
        <a-button v-if="!imgPath">
          <upload-outlined></upload-outlined>
          点击上传图片
        </a-button>
        <div v-else>
          <a-image :src="imgPath"></a-image>
        </div>
      </a-upload>
    </a-form-item>
    <!-- <a-form-item has-feedback label="图片预览">
      <a-image
        :v-if="imgPath"
        :width="200"
        :src="imgPath"
      />
    </a-form-item> -->

    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" html-type="submit">添加商品</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, reactive, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import request from "../../api";

export default defineComponent({
  components: {
    UploadOutlined,
  },
  setup() {
    const formRef = ref();
    const formState = reactive({
      name: "",
      newPrice: undefined,
      class: "",
      info: "",
    });

    const baseUrl = "http://192.168.1.4:3001/";
    let imgPath = ref();
    let showUpload = ref(false);

    let validateName = async (_rule, value) => {
      if (value === "") {
        return Promise.reject("请输入商品名称");
      } else if (value.length <= 2) {
        return Promise.reject("商品名称不能少于两位");
      } else {
        return Promise.resolve();
      }
    };
    let checkPrice = async (_rule, value) => {
      if (!value) {
        return Promise.reject("请输入商品价格");
      } else if (value < 0) {
        return Promise.reject("请输入大于0的数");
      } else {
        return Promise.resolve();
      }
    };

    let validateInfo = async (_rule, value) => {
      if (value == "") {
        return Promise.reject("请输入商品信息");
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      name: [
        {
          required: true,
          validator: validateName,
          trigger: "change",
        },
      ],
      newPrice: [
        {
          required: true,
          validator: checkPrice,
          trigger: "change",
        },
      ],
      info: [
        {
          required: true,
          validator: validateInfo,
          trigger: "change",
        },
      ],
    };
    const layout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    };

    let MyForm = new FormData();
    let MyFile = ref();
    let MyFileList = ref([]);

    const handleFinishFailed = (errors) => {
      console.log(errors);
    };

    const resetForm = () => {
      formRef.value.resetFields();
      fileList.value.splice(0);
    };

    const handleValidate = (...args) => {
      // console.log(args);
    };

    let fileList = ref([]);

    // 上传图片
    const handleChange = (info) => {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
        sessionStorage.setItem("file", JSON.stringify(fileList));
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} 文件上传成功`);
        imgPath.value = baseUrl + info.file.response.filename;
        // console.log(fileList);
        // sessionStorage.setItem("file", fileList);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 文件上传失败`);
      }
    };

    const beforeUpload = (file, fileList) => {
      MyFile = file;
      MyFileList = fileList;
      console.log("file:", file);
      console.log("fileList：", fileList);
      return false;
    };

    const handleFinish = async (values) => {
      MyForm = new FormData();
      for (const key in values) {
        if (Object.hasOwnProperty.call(values, key)) {
          const element = values[key];
          MyForm.append(key, element);
        }
      }
      if (fileList.value.length <= 0) {
        message.error("请上传该商品图片");
      } else {
        upLoadImg();
      }
    };

    const upLoadImg = async () => {
      MyForm.append("file", MyFile, MyFile.name);
      let res = await request.post("/api/upload/addShops", MyForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);
      if(res.status == 200 && res.data.err_code == 0) {
        resetForm()
        fileList.value.splice(0)
        message.success(res.data.message)
      } else {
        message.error(res.data.message)
      }
    };

  

    onMounted(() => {
      // fileList = JSON.parse(sessionStorage.getItem("file"));
      // console.log(fileList);
    });
    const progress = {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
      class: "test",
    };

    const selectImg = () => {
      fileList = [];
    };

    return {
      formState,
      formRef,
      rules,
      layout,
      handleFinishFailed,
      handleFinish,
      resetForm,
      handleValidate,
      // 上传图片
      fileList,
      headers: {
        authorization: "authorization-text",
      },
      handleChange,
      progress,
      beforeUpload,
      showUpload,
      imgPath,
      selectImg,
      upLoadImg,
    };
  },
});
</script>
