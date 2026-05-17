'use client';

import RouteErrorState from '../../../components/RouteErrorState';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <RouteErrorState
      title="页面加载失败"
      message="这个中文页面渲染时遇到问题，请重试。"
      reset={reset}
    />
  );
}
