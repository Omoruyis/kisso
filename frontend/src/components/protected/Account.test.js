import React from 'react'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme'
import { findByTestAtrr } from '../../utils'
import Account from './Account';

import Auth from '../authenticate/authenticate'

Enzyme.configure({ adapter: new Adapter() })

describe('Login Component', () => {

    describe('Renders', () => {

        let component

        beforeEach(() => {
            component = shallow(<Account />)
        })

        it('Should Render without error', () => {
            const accountComponent = findByTestAtrr(component, 'AccountComponent')
            if (Auth.getAuth()) {
                expect(accountComponent.length).toBe(1)
            } else {
                expect(accountComponent.length).toBe(0)
            }
        })
    })
})