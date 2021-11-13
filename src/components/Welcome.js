import React, { useContext } from 'react';
// import { pageLayout } from '../pageLayouts';
import { AuthContext } from '../contexts/AuthContext';

export function Welcome() {
    const {user} = useContext(AuthContext);

    return (
        <>
            <p> Welkom,&nbsp;
                {!!user ? (
                    <>
                        {user.username}
                    </>
                ) : (
                    <>
                        gast
                    </>
                )}.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi corporis est ipsum numquam, quaerat
                recusandae reiciendis velit vitae? Accusantium ad est exercitationem harum inventore ipsam laudantium
                magni nam nemo odit pariatur quia quisquam quos repellendus similique suscipit tenetur ullam, ut veniam,
                voluptatum! Eligendi enim molestias quasi, qui recusandae sequi totam.
            </p>
        </>
    );
}