import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function test(model: string, extra: any) {
  try {
    const res = await axios.post("https://open.bigmodel.cn/api/paas/v4/images/generations", {
      model: model,
      prompt: "A cute cat",
      ...extra
    }, {
       headers: { 'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}` }
    });
    console.log(`[${model}] Success:`, res.data.data[0].url);
  } catch (e: any) {
    console.error(`[${model}] Error:`, e.response?.data || e.message);
  }
}

async function main() {
  await test("glm-image", { watermark: false });
  await test("cogview-3-plus", { watermark: false });
  await test("cogview-3-plus", {});
}
main();
