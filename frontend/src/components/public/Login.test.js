import React from 'react'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme'
import { findByTestAtrr } from '../../utils'
import Login from './Login';

Enzyme.configure({ adapter: new Adapter() })

describe('Login Component', () => {

    describe('Renders', () => {

        let component

        beforeEach(() => {
            component = shallow(<Login />)
        })

        it('Should Render without error', () => {
            const loginComponent = findByTestAtrr(component, 'loginComponent')
            expect(loginComponent.length).toBe(1)
        })
    })
})