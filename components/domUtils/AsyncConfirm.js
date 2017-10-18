;((global) => {

    global.AsyncConfirm = function (){

        let $confirm
        return {
            show: (message) => new Promise((resolve, reject) => {
                $confirm = document.dom`
                    <div class="confirmModal">
                        <div class="confirmModal-box">

                            <p class="confirmModal-message">
                                ${message}
                            </p>

                            <button class="confirmModal-btn confirmModal-btn--yes">
                                Yes
                            </button>
                            <button class="confirmModal-btn confirmModal-btn--cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                `
                document.body.appendChild($confirm)

                $confirm.addEventListener('click', (event) => {
                    if(event.target.classList.contains('confirmModal-btn--yes')){
                        $confirm.remove()
                        resolve()
                    } else if(event.target.classList.contains('confirmModal-btn--cancel')){
                        $confirm.remove()
                        reject()
                    }
                })
            })
            ,remove: () => {
                $confirm.remove()
            }
        }
    }

})(window)