$(document).ready(function(){
    var socket = io();

    var room = $('#groupName').val();
    var sender = $('#sender').val();

    socket.on('connect', function(){
        var params = {
            sender: sender
        }

        socket.emit('joinRequest', params, function(){
            console.log('Joined');
        });
    });

    $('#add_friend').on('submit', function(e){
        e.preventDefault();

        var receiverName = $('#receiveName').val();

        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                receiverName: receiverName
            },
            success: function(){
                socket.emit('friendRequest', {
                    receiver: receiverName,
                    sender: sender
                }, function(){
                    console.log("Request Sent");
                })
            }
        })
    })

    socket.on('newFriendRequest', function(friend){
        //console.log(friend);
        $("#reload").load(location.href + ' #reload');

        $(document).on('click','#accept_friend',function(e){
            var senderId = $('#senderId').val();
            var senderName = $('#senderName').val();
    
            $.ajax({
                url: '/group/'+room,
                type: 'POST',
                data: {
                    senderId: senderId,
                    senderName: senderName
                },
                success: function(){
                    $(this).parent().eq(1).remove()
                }
            })
            $("#reload").load(location.href + ' #reload');
        })

        $(document).on('click','#user_Id',function(e){
            var user_Id = $('#user_Id').val()

        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                user_Id: user_Id
            },
            success: function(){
                $(this).parent().eq(1).remove()
            }
        })
        $("#reload").load(location.href + ' #reload');
        })
    })

    $('#accept_friend').on('click', function(e){
        var senderId = $('#senderId').val();
        var senderName = $('#senderName').val();

        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                senderId: senderId,
                senderName: senderName
            },
            success: function(){
                $(this).parent().eq(1).remove()
            }
        })
        $("#reload").load(location.href + ' #reload');
    })

    $('#cancel_friend').on('click', function(e){
        var user_Id = $('#user_Id').val()

        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                user_Id: user_Id
            },
            success: function(){
                $(this).parent().eq(1).remove()
            }
        })
        $("#reload").load(location.href + ' #reload');
    })
})