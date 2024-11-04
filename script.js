
var jq = jQuery.noConflict(true); // Restore jQuery in noConflict mode

let selectedTrack = '';
let selectedBell = '';
let selectedGestures = new Array();
let $gridBell;
let $gridTrack;
jq(document).ready(function() {
    // init Isotope
    $gridTrack = jq(".track-list").isotope({
        itemSelector: '.music-item',
        layoutMode: 'vertical'
    });
    // init Isotope
    $gridBell = jq(".bell-list").isotope({
        itemSelector: '.bell-item',
        layoutMode: 'vertical'
    });
    $gridBell.isotope({ filter: '*'});
    
    let preivousTrack =  '';
    jq('.track-list').on( 'click', 'div', function() {
        const number = jq(this).find('.number').text();
        if (preivousTrack === number)
        {
            $gridTrack.isotope({filter: '*'});
            preivousTrack = '';
            selectedTrack = '';
        }
        else
        {
            $gridTrack.isotope({ filter: '.' + number + ', .header, .credits' });
            preivousTrack = number;
            selectedTrack = jq(this).find('.track-audio')[0];
        }
    });
    
    let preivousBell =  '';
    jq('.bell-list').on( 'click', 'div', function() {
        const number = jq(this).find('.number').text();
        if (preivousBell === number)
        {
            $gridBell.isotope({filter: '*'});
            preivousBell = '';
            selectedBell = '';
        }
        else
        {
            $gridBell.isotope({ filter: '.' + number + ', .header, .credits' });
            preivousBell = number;
            selectedBell = jq(this).find('.track-audio')[0];
        }
    });
    
    jq('.grid-item').on( 'click', function() {
        const imageSrc = jq(this)[0].firstElementChild.src;
        let isAlreadySelected = false;
        selectedGestures.forEach(element => {
            if (imageSrc === element)
                isAlreadySelected = true;
        });
        if (!isAlreadySelected)
        {
            jq(this)[0].classList.add('border');
            jq(this)[0].classList.add('bd-lightGreen');
            jq(this)[0].classList.add('border-size-2');
            selectedGestures.push(imageSrc);
        }
        else
        {
            jq(this)[0].classList.remove('border');
            jq(this)[0].classList.remove('bd-lightGreen');
            jq(this)[0].classList.remove('border-size-2');
            let tempArray = new Array();
            selectedGestures.forEach(element => {
                if (imageSrc !== element)
                    tempArray.push(element)
            });

            selectedGestures = new Array();
            tempArray.forEach(element => {
                selectedGestures.push(element)
            });
        }
    });
});


const tabs = document.querySelectorAll('.tab');
const playlists = document.querySelectorAll('.playlist-container');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and playlists
        tabs.forEach(t => t.classList.remove('active'));
        playlists.forEach(p => p.classList.remove('active'));

        // Add active class to clicked tab and corresponding playlist
        tab.classList.add('active');
        const activeTab = (tab.getAttribute('data-tab'));
        document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
        if  (activeTab === 'bells')
        {
            jq('.track.bell-item.header').click();
        }
        else if (activeTab === 'music')
        {            
            jq('.track.music-item.header').click();
        }
    });
});

let countdownInterval;
function startMeditation()
{   
    let gestureIndex = 0;
    const timePickerVal = $('#timepicker').val().split(':');
    const bellTimePickerVal = $('#timepickerbell').val().split(':');
    let countDownTime = parseInt(timePickerVal[0]) * 60 * 60;
    countDownTime += parseInt(timePickerVal[1]) * 60;
    countDownTime += parseInt(timePickerVal[2]);
    if (selectedGestures.length === 0)
    {
        $('#dialog-gestures').addClass('hidden');
    }
    else
    {
        $('#dialog-image').attr("src", selectedGestures[gestureIndex]);
        $('#dialog-text')[0].innerHTML = selectedGestures.length.toString() + " Gestures Left";
    }
    
    if  (selectedTrack != '')
    {
        //starts playing
        selectedTrack.currentTime = 0; // if it is played while selecting start again
        selectedTrack.play();
    }

    $('#timerDiv').timer({
        countdown: true,
        duration: timePickerVal[0] + 'h' + timePickerVal[1] + 'm' + timePickerVal[2] + 's',
        callback: function() {            
            stopMeditation();
        },
        repeat: false //repeatedly calls the callback you specify
    });
    
    $('#timerDivBell').timer({
        countdown: true,
        duration: bellTimePickerVal[0] + 'h' + bellTimePickerVal[1] + 'm' + bellTimePickerVal[2] + 's',
        callback: function() {
            if (!selectedBell.paused)
            {
                selectedBell.pause();
            }
            selectedBell.currentTime = 0;      
            selectedBell.play();
            
            if (selectedGestures.length != 0)
            {
                gestureIndex++;
                const remainingGesture = selectedGestures.length - gestureIndex;
                if  (remainingGesture > 0)
                {
                    $('#dialog-text')[0].innerHTML = remainingGesture + " Gestures Left";
                    $('#dialog-image').attr("src", selectedGestures[gestureIndex]);
                }
                else
                {
                    $('#dialog-gestures').addClass('hidden');
                }    
            }

            $('#timerDivBell').timer('reset');
        },
        repeat: true //repeatedly calls the callback you specify
    });

    $('#customDialog').removeClass('hidden');
    $('#backdrop').removeClass('hidden');
}

function stopMeditation() {
    $('#bellFinal')[0].currentTime = 0;
    $('#bellFinal')[0].play();
    if (selectedTrack != '')
    {
        selectedTrack.pause();
        selectedTrack.currentTime = 0;
        selectedTrack.click();
        $gridTrack.isotope({ filter: '*'});
        selectedTrack = '';
    }
    selectedBell.pause();
    selectedBell.currentTime = 0;
    selectedBell.click();
    $gridBell.isotope({ filter: '*'});
    selectedBell = '';
    selectedGestures = new Array();
    var itemList = document.getElementsByClassName('grid-item');
    for (let iter = 0; iter < itemList.length; iter++)
    {        
        itemList[iter].classList.remove('border');
        itemList[iter].classList.remove('bd-lightGreen');
        itemList[iter].classList.remove('border-size-2');
    }
    $('#tab-music').click();
    $('#customDialog').addClass('hidden');
    $('#backdrop').addClass('hidden');
    $('#dialog-gestures').removeClass('hidden');
    $('#timerDiv').timer('remove');
    $('#timerDivBell').timer('remove');
}