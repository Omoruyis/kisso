import React from 'react'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme'
import moxios from 'moxios'
import { findByTestAtrr } from '../../utils'
import Home from './Home';

import Auth from '../authenticate/authenticate'

Enzyme.configure({ adapter: new Adapter() })

describe('Login Component', () => {

    describe('Renders', () => {

        let component

        beforeEach(() => {
            component = shallow(<Home />)
        })

        it('Should Render without error', () => {
            const homeComponent = findByTestAtrr(component, 'HomeComponent')
            if (Auth.getAuth()) {
                expect(homeComponent.length).toBe(1)
            } else {
                expect(homeComponent.length).toBe(0)
            }
        })
    })

    // describe('Renders Users', () => {

    //     const users = [{
    //         firstName: 'Isaac',
    //         lastName: 'Omoruyi',
    //         job: 'Software Engineer',
    //         email: 'omoruyi@yahoo.com'
    //     }]

    //     let component

    //     beforeEach(() => {
    //         moxios.install()
    //         component = shallow(<Home />)
    //     })

    //     afterEach(() => {
    //         moxios.uninstall()
    //     })

    //     moxios.wait(() => {
    //         const request = moxios.requests.mostRecent()
    //         request.respondWith({
    //             status: 200,
    //             response: users
    //         })
    //         setUsers(users)
    //     })
    //     console.log(component.debug())

    //     it('Should Render users without error', () => {
    //         const users = findByTestAtrr(component, 'userComponent')
    //         expect(users.length).toBe(1)
    //     })
    // })
})