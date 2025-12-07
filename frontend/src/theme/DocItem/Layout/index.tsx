import React from 'react';
import DocItemLayout from '@theme-original/DocItem/Layout';
import type { Props } from '@theme/DocItem/Layout';
import TranslateButton from '../../../components/TranslateButton';

export default function DocItemLayoutWrapper(props: Props): JSX.Element {
  return (
    <>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <TranslateButton />
      </div>
      <DocItemLayout {...props} />
    </>
  );
}
