// 共享传输层：所有请求的统一入口。接入真实后端 / 鉴权时只改这里。
export async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`请求失败 ${res.status}：${url}`);
  return (await res.json()) as T;
}
