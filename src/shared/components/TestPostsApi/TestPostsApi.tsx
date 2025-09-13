'use client'

import {Button} from "@/src/shared/components/Button/Button";
import {useGetMeQuery} from "@/src/feature/auth/api/authApi";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostsByUsedIdQuery,
  useUpdatePostMutation, useUploadPostImagesMutation
} from "@/src/feature/Posts/api/postsApi";
import {useRef} from "react";
import Image from 'next/image'

export const TestPostsApi = () => {
  const {data: getMe} = useGetMeQuery()
  const userId = getMe?.id.toString()
  const imgRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {data: getPosts} = useGetPostsByUsedIdQuery({userId}, {skip: !getMe?.id.toString()})
  const [createPost, {data: createPostData}] = useCreatePostMutation()
  const [deletePost] = useDeletePostMutation()
  const [updatePost] = useUpdatePostMutation()
  const [uploadImg, {data: uploadImgData}] = useUploadPostImagesMutation()

  // console.log("CreatePost", createPostData)
  // console.log("UploadImg")
  console.log("Posts", getPosts)

  const createPostHandler = async () => {
    try {
      const images: File[] = Array.from(imgRef.current?.files ?? [])
      const dataPost = await createPost({description: 'Test2'}).unwrap()
      console.log('CreatePostData', dataPost)
      const imgData = await uploadImg({postId: dataPost.id, images}).unwrap()
      console.log('UploadImgData', imgData)
    } catch (e) {
    }
  }


  return (
    <div>
      <input type="file" multiple ref={imgRef}/>
      <br/>
      <Button onClick={() => createPostHandler()}>createPost and uploadIMG</Button>
      <Button onClick={() => console.log(imgRef.current?.files)}>Проверить imgRef</Button>


      {getPosts?.items.map((post) => {
          console.log('URL', post.images[0])
          return <div key={post.id}>
            <h2>ПОСТ</h2>
            <Image src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${post.images[0]?.url ?? ''}`} width={300} height={300}
                   alt={'photo from back'}/>
            <p>{post.description}</p>
            <Button onClick={() => {
              deletePost({postId: post.id})
            }}>Del</Button>

            <br/>
            <input style={{color: 'black'}} ref={inputRef} type="text"/>
            <Button onClick={() => {
              const description = inputRef.current?.value
              updatePost({postId: post.id, description})
            }}>update
              description</Button>
            <hr/>

          </div>
        }
      )}
      {/*<Image src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${uploadImgData?.[0].url ?? ''}`} width={300} height={300} alt={'photo from back'}/>*/}
    </div>
  );
};