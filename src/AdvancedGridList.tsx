/* eslint-disable require-jsdoc */
import React from 'react'
import moment from 'moment'
import { User } from '@sensenet/default-content-types'
import { IconButton } from '@material-ui/core'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import { useRepository } from './hooks/use-repository'
import { useStyles } from './app'
import { AdvancedGridprops } from './Interface'

export function AdvancedGridList(props: AdvancedGridprops) {
  const classes = useStyles()
  const repo: any = useRepository()

  function pickTile(anumber: any) {
    let tilenumber = anumber % 3
    tilenumber = tilenumber === 0 ? 2 : 1
    return tilenumber
  }
  return (
    <div className={classes.root}>
      <GridList cellHeight={200} spacing={1} className={classes.gridList}>
        {props.imgList.map((tile, index) => (
          <GridListTile key={tile.Id} cols={pickTile(index)} rows={pickTile(index)}>
            <img
              className={classes.imgTile}
              src={repo.configuration.repositoryUrl + tile.Path}
              onClick={() =>
                props.openFunction({
                  imgCreationDate: moment(new Date(tile.CreationDate ? tile.CreationDate : '')).format(
                    'YYYY-MM-DD HH:mm:ss',
                  ),
                  imgIndex: index,
                  imgPath: repo.configuration.repositoryUrl + tile.Path,
                  imgTitle: tile.DisplayName ? tile.DisplayName : '',
                  imgDescription: tile.Description ? tile.Description : '',
                  imgAuthor: '',
                  imgAuthorAvatar: tile.DisplayName ? tile.DisplayName : '',
                  imgSize: `${(tile.Size ? tile.Size / 1024 / 1024 : 0).toFixed(2)} MB`,
                })
              }
              alt={tile.Description}
            />
            <GridListTileBar
              title={tile.DisplayName}
              titlePosition="bottom"
              subtitle={<span>by: {(tile.CreatedBy as User).FullName}</span>}
              actionIcon={<IconButton aria-label={`star ${tile.DisplayName}`} className={classes.icon}></IconButton>}
              actionPosition="left"
              className={classes.titleBar}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}
