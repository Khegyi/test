/* eslint-disable require-jsdoc */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import { ConstantContent, ODataCollectionResponse } from '@sensenet/client-core'
import moment from 'moment'
import { CssBaseline, Slide } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'
import { makeStyles } from '@material-ui/core/styles'
import snLogo from './assets/sensenet_logo_transparent.png'
import { useRepository } from './hooks/use-repository'
import FullScreenDialog from './FullScreenDialog'
import { AdvancedGridList } from './AdvancedGridList'
import { SelectedImage } from './Interface'

const drawerWidth = 240

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'visible',
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  drawer: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
    flexShrink: 0,
  },
  appBar: {
    width: '100%',
    marginRight: '0',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    display: 'none',
    marginTop: '64px',
  },
  drawerPaper: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      display: 'block',
      position: 'relative',
    },
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
    zIndex: 1099,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  imgTile: {
    cursor: 'pointer',
  },
  imgTileFullSize: {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxHeight: '84vh',
    flexDirection: 'row',
    marginTop: '60px',
  },
  selectedImgContent: {
    width: '100%',
    height: '94vh',
    display: 'flex',
    alignItems: 'center',
  },
  drawerMain: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      right: '0',
    },
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      right: drawerWidth,
    },
    display: 'block',
    height: '100%',
  },
  gridList: {
    width: '100%',
    height: 'auto',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    // eslint-disable-next-line no-useless-concat
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  defaultAvatarimg: {
    marginBottom: '-5px',
  },
  avatarImg: {
    height: '24px',
    width: '24px',
    borderRadius: '50%',
    marginLeft: '5px',
  },
}))

export const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />
})

export const App: React.FunctionComponent = () => {
  const repo = useRepository()
  const [open, setOpen] = React.useState(false)
  const [data, setData] = useState<any[]>([])
  const [selectedimage, setSelectedimage] = React.useState<SelectedImage>({
    imgIndex: 0,
    imgPath: '',
    imgTitle: '',
    imgDescription: '',
    imgAuthor: '',
    imgAuthorAvatar: '',
    imgCreationDate: '',
    imgSize: '',
    imgDownloadUrl: '',
  })
  // Opens the Details View and Fetches the datas for the Selected Image
  function getSelectedImage(imageIndex: number, openInfoTab: boolean) {
    const selectedImage = data[imageIndex]
    setSelectedimage({
      imgIndex: imageIndex,
      imgPath: repo.configuration.repositoryUrl + selectedImage.Path,
      imgTitle: selectedImage.DisplayName,
      imgDescription: selectedImage.Description,
      imgAuthor: selectedImage.CreatedBy.FullName,
      imgAuthorAvatar: 'https://dev.demo.sensenet.com//Root/Content/demoavatars/businesscat.jpeg',
      //imgAuthorAvatar: selectedImage.CreatedBy.Avatar.Url,
      imgCreationDate: moment(new Date(selectedImage.CreationDate ? selectedImage.CreationDate : '')).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      imgSize: `${(selectedImage.Size ? selectedImage.Size / 1024 / 1024 : 0).toFixed(2)} MB`,
      imgDownloadUrl: repo.configuration.repositoryUrl + selectedImage.Binary.__mediaresource.media_src,
    })
    if (openInfoTab) {
      setOpen(true)
    }
  }
  // Close the Details View
  function handleClose() {
    setOpen(false)
  }
  useEffect(() => {
    async function loadImages(): Promise<void> {
      const result: ODataCollectionResponse<any> = await repo.loadCollection({
        path: `${ConstantContent.PORTAL_ROOT.Path}/Content/IT/ImageLibrary`,
        oDataOptions: {
          select: [
            'Binary',
            'DisplayName',
            'Description',
            'CreationDate',
            'CreatedBy',
            'Height',
            'ModificationDate',
            'Size',
            'Width',
          ] as any,
          expand: ['CreatedBy'] as any,
        },
      })
      console.log(result.d.results)
      setData(result.d.results)
    }
    loadImages()
  }, [repo])
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${snLogo})`,
        backgroundSize: 'auto',
      }}>
      <CssBaseline />
      <AdvancedGridList openFunction={getSelectedImage} imgList={data} />
      <FullScreenDialog
        openedImg={selectedimage}
        steppingFunction={getSelectedImage}
        isopen={open}
        closeFunction={handleClose}
        imgList={data}
      />
    </div>
  )
}
