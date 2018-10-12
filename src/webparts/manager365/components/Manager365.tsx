import * as React from 'react';
import Styles from './Manager365.module.scss';
import { IManager365Props } from './IManager365Props';
import { IManager365States } from './IManager365States';
import { escape } from '@microsoft/sp-lodash-subset';
import { SearchService } from '../data/SearchService';
import { 
  Spinner,
  Nav,
  INavProps
} from 'office-ui-fabric-react';

import SiteNode from './nodes/SiteNode';

export default class Manager365 extends React.Component<IManager365Props, IManager365States> {
  constructor(props)
  {
    super(props);
    this.state={loading:true, siteUrls:[]}
  }

  public componentDidMount(): void {
    this.loadSiteCollection();
  }

  public render(): React.ReactElement<IManager365Props> {
    let siteLinks: any = this.state.siteUrls.map(
      function(url, index){ 
        return {name: url, url: url, key: index} ;
      }
    )

    const loading = this.state.loading ? <Spinner label='loading...' /> : <div />;

    return (
      <div className={ Styles.manager365 }>
        <div className={ Styles.container }>
          <div className={ Styles.row }>
            <div className={ Styles.column }>
              <span className={ Styles.title }>Welcome to Manager365 Webpart!</span>
              <p className={ Styles.subTitle }>View/Manage your SharePoint Online by Manager365.</p>
              <p className={ Styles.description }>{escape(this.props.description)}</p>
                {
                  loading
                }
                <div className="ms-NavExample-LeftPane">
                  {
                    <Nav
                      groups={
                        [
                          {
                            links: [
                              {
                                name: "Tenant",
                                url: "",
                                links: siteLinks,
                                isExpanded: false
                              }
                            ]
                          }
                        ]
                      }
                    />
                  }
                </div>
                
            </div>
          </div>
        </div>
      </div>
    );
  }

  public loadSiteCollection(): void{
    let self = this;
    let serverUrl = `${window.location.protocol}//${window.location.hostname}`;
    let service = new SearchService(this.props.spHttpClient);
    service.getSitesStartingWith(serverUrl).then((urls) => { 
        self.setState({loading:false, siteUrls: urls})
      }).catch(e=>console.log(e));
  }
}
