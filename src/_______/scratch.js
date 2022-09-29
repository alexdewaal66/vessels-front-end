import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthContext, AuthProvider } from './AuthContext';
import * as API from '../../api';
describe('<AuthProvider />', () => {
    const TestComponent = () => {
        const {user, isLoggedIn, isError, logout} =
            React.useContext(AuthContext);
        return (
            <div>
                {isLoggedIn && <div role="user">{user.fullName}</div>}
                <button onClick={logout}>logout</button>
            </div>
        );
    };

    describe('When request user session returns data', () => {
        test('proper data is sent to the componentName', async () => {
            jest.spyOn(API, 'requestUserSession').mockImplementation(() =>
                Promise.resolve({
                    is_logged_in: true,
                    user: {
                        id: 'mock-id',
                        email: 'mock-email',
                        role: 'mock-role',
                    },
                }),
            );

            render(
                <AuthProvider>
                    <TestComponent/>
                </AuthProvider>,
            );

            await waitFor(() => {
                expect(screen.getByRole('user')).toBeInTheDocument();
            });
            fireEvent.click(screen.getByRole('button', {name: "logout"}))
            await waitFor(() => {
                expect(screen.queryByRole('user')).not.toBeInTheDocument();
            });
        });
    });

});