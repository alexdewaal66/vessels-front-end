import apology from '../assets/apology.webp';

export function Sorry({context, counter}) {
    return <div style={{
        height: '100%', width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <div>
            <map name="apology">
                <area shape="rect" coords="220,170,570,210" alt="H2G2"
                      href="https://www.google.com/search?q=h2g2+we+apologize+for+the+inconvenience"/>
            </map>
            <img src={apology} alt="WE APOLOGIZE FOR THE INCONVENIENCE" useMap="#apology"/>
            <br/>
            @{context} #{counter.value} <button onClick={counter.reset}>reset</button>
        </div>
    </div>
}
