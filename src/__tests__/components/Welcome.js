import { render, screen } from '@testing-library/react';
import { Welcome } from '../../components';
import { AuthContext } from '../../contexts';


describe("<Welcome />", () => {

    describe('no user', () => {
        const authData = {};
        beforeEach(() => {
            render(
                <AuthContext.Provider value={authData}>
                    <Welcome/>
                </AuthContext.Provider>
            );
        });

        test('<Welcome /> renders "Welkom"', () => {
            const element = screen.getByText(/welkom/i);
            expect(element).toBeInTheDocument();
        });

        test('<Welcome /> renders "gast"', () => {
            const element = screen.getByText(/gast/i);
            expect(element).toBeInTheDocument();
        });

    });
    describe('user = "gewoonlid"', () => {
        const authData = {user: {username: 'gewoonlid'}};
        beforeEach(() => {
            render(
                <AuthContext.Provider value={authData}>
                    <Welcome/>
                </AuthContext.Provider>
            );
        });

        test('<Welcome /> renders "Welkom"', () => {
            const element = screen.getByText(/Welkom/i);
            expect(element).toBeInTheDocument();
        });

        test('<Welcome /> renders "gewoonlid"', () => {
            const element = screen.getByText(/gewoonlid/i);
            expect(element).toBeInTheDocument();
        });

    });


});