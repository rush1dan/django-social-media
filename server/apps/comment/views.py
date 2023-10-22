from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.post.models import Post
from apps.comment.models import Comment
from apps.comment.serializers import CommentCreateSerializer, get_serialized_user_comments

from traceback import print_exc as print_error

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
## Retrieve comments or Create Comment
def comments_view(request, pk):
    try:
        requestingUser = request.user
        targetPost = Post.objects.get(id=pk)

        if request.method == 'GET':
            serialized_comments_data = get_serialized_user_comments(targetPost)
            return Response(serialized_comments_data, status=200)
        elif request.method == 'POST':
            serializer = CommentCreateSerializer(data=request.data)
            if serializer.is_valid():  
                comment = serializer.save(user_id=requestingUser.id, post_id=pk)
                return Response("Comment created", status=201)
            else:
                return Response("Invalid request", status=400)
        else:
            return Response("Invalid request", status=400)
    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)
