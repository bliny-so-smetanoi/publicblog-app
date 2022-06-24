import {isMobile} from 'react-device-detect'

export default function Footer(){

    return(
        <>
            {!isMobile &&
                <footer className={'footer-main'}>
                <div className={'footer-block'}>
                    <span>
                        © Public Blog App by bliny so smetanoi<br/>
                        Nur-Sultan, Qazaqstan 2022
                    </span>
                </div>
            </footer>}
        </>
    )
}