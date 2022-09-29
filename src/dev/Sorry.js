import apology from '../assets/apology.webp';

export function Sorry({context, count}) {
    return <div style={{
        height: '100%', width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <div>
            <img src={apology} alt="WE APOLOGIZE FOR THE INCONVENIENCE"/>
            <br/>
            @{context} #{count}
        </div>
    </div>
}
