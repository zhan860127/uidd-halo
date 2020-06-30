<template>
  <div>
    <ImgInput v-model="src" style="margin: 90px auto 50px;" />
    <div class="name-input-ctn">
      <div class="d-flex">
        <label id="name-label" for="name-input">裝置名稱</label>
        <input id="name-input" v-model="name" />
      </div>
      <div class="confirm" @click="submit">更改確認</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ImgInput from '~/components/ImgInput.vue';

@Component({ layout: 'parent', components: { ImgInput } })
export default class classname extends Vue {
  src: string = '';
  name: string = '';
  oldSrc: string = '';

  created() {
    this.name = this.$store.state.parent.childStatus.filter(
      (child: { id: number }) => child.id === +this.$route.query.c
    )[0].name;
    this.oldSrc = this.src = `/api/parent/childpic?id=${this.$route.query.c}`;
  }

  async submit() {
    const fd = new FormData();
    if (this.src !== this.oldSrc) {
      const blob = await fetch(this.src).then((res) => res.blob());
      fd.append('img', blob);
    }
    fd.append('id', this.$route.query.c.toString());
    fd.append('name', this.name);
    await this.$axios({
      url: '/api/parent/edit_child',
      method: 'post',
      data: fd,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('success!');
  }
}
</script>

<style lang="scss" scoped>
.name-input-ctn {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 19px;
  width: 221px;
  padding: 19px;
  margin: 0 auto;
}

#name-label {
  background-color: #fde9d2;
  display: block;
  border-radius: 7px;
  padding: 3px 6px;
}

.confirm {
  background-color: #fde9d2;
  display: block;
  border-radius: 7px;
  padding: 3px 6px;
  margin: 80px auto 0;
  width: fit-content;
}

#name-input {
  display: block;
  flex-grow: 1;
  width: 0;
  &,
  &:active,
  &:focus {
    border: none;
    border-bottom: 1px solid #707070;
  }
  padding-left: 0.3em;
}
</style>
