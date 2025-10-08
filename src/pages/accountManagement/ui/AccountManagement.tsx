import { FlexContainer } from '@/src/shared/ui/FlexContainer'
import { Card } from '@/src/shared/ui/Card/Card'
import s from './AccountManagement.module.scss'
import { RadioButtonsGroup } from '@/src/shared/ui/RadioButtonsGroup/RadioButtonsGroup'
import { useState } from 'react'

export const AccountManagement = () => {
  const [accountTypeRadio, setAccountTypeRadio] = useState('personal')

  return (
    <FlexContainer>
      <section>
        <h2 className={s.title}>Account type:</h2>
        <Card>
          <RadioButtonsGroup
            name={'account type'}
            value={accountTypeRadio}
            onChange={setAccountTypeRadio}
            options={[
              { value: 'personal', label: 'Personal' },
              { value: 'business', label: 'Business' },
            ]}
          ></RadioButtonsGroup>
        </Card>
      </section>
    </FlexContainer>
  )
}
