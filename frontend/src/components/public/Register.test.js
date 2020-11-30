import React from 'react'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme'
import { findByTestAtrr } from '../../utils'
import Register from './Register';

Enzyme.configure({ adapter: new Adapter() })

describe('Login Component', () => {

    describe('Renders', () => {

        let component

        beforeEach(() => {
            component = shallow(<Register />)
        })

        it('Should Render without error', () => {
            const registerComponent = findByTestAtrr(component, 'registerComponent')
            expect(registerComponent.length).toBe(1)
        })
    })
})