/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Entity } from '@backstage/catalog-model';
import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { OwnerEntityColumn } from './OwnerEntityColumn';
import { identityApiRef } from '@backstage/core-plugin-api';

describe('<OwnerEntityColumn />', () => {
  const catalogApi = catalogApiMock.mock();
  const identityApi = mockApis.identity();

  it('should render the column with the user', async () => {
    const props = {
      entityRef: 'user:default/foo',
    };

    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'User',
      metadata: {
        name: 'test',
      },
      spec: {
        profile: {
          displayName: 'BackUser',
        },
      },
    };
    catalogApi.getEntityByRef.mockResolvedValue(entity);

    const { getByText, getByRole } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
        ]}
      >
        <OwnerEntityColumn {...props} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByRole('link')).toHaveAttribute(
      'href',
      '/catalog/default/user/foo',
    );
    const text = getByText('BackUser');
    expect(text).toBeDefined();
  });
});
