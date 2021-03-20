import { Injectable } from '@angular/core';
import { UrlPreviewResponse } from './../../models/urlPreviewResponse';
import { HttpService } from './../../services/http-service/http.service';
import { AppUrl } from './../../models/appUrl';

@Injectable()

export class TextService {
  constructor(private _httpService: HttpService) { }

  public greetingText: string = '<h3 class="text-center mt-2"> Добро пожаловать! </h3><br>' +
                                '<span class="mt-2"> Небольшая инструкция по работе с приложением: </span><br>' +

                                '<li class="ml-1 mt-1"> Здесь вы можете сохранять текст и файлы любого типа в специально созданных для них группах. </li>' +
                                '<li class="ml-1 mt-1"> Количество создаваемых групп не ограничено. </li>' +
                                '<li class="ml-1 mt-1"> Одно сообщение (заметка) вмещает в себя текст (длиной до 5 тысяч символов) и файлы (максимум 32 файла. До 8 штук каждого из 4 типов: \'изображения\',' +
                                '\'видео\', \'аудио\' и отдельно \'остальные типы файлов\'). </li>' +
                                '<li class="ml-1 mt-1"> После сохранения файлов вы также можете их скачать (для файлов \'аудио\' и \'остальные типы файлов\' нужно ' +
                                'кликнуть по их имени) </li>' +
                                '<li class="ml-1 mt-1"> После регистрации автоматически создается одна группа. Можете ее удалить или переименовать, а также создавать новые. </li>' +
                                '<li class="ml-1 mt-1"><b>ВАЖНО!!</b> При удалении всех групп сохранять информацию будет некуда, так что как минимум одна группа все-равно необходима. </li>';

  public rolesTranslation = { 'User': 'Пользователь', 'Administrator': 'Администратор' };

  public getUrlsFromText(text: string): string[] {
    let matches: string[] = [];
    if (text.length) {
      matches = text.match(/(https?: \/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g);
    }
    return matches ? matches : [];
  }

  private _isUrlWithPreview(url: string, urlsCollection: AppUrl[] | UrlPreviewResponse[]): boolean {
    for (let appUrl of urlsCollection) {
      if (appUrl.url === url) {
        return true;
      }
    }
    return false;
  }

  public convertUrlsToAppUrls(urls: string[], appUrls: AppUrl[]): AppUrl[] {
    for (let url of urls) {
      if (!this._isUrlWithPreview(url, appUrls)) {
        appUrls.push(new AppUrl(url));
      }
    }
    return appUrls;
  }

  public getPreviewsForUrls(urls: AppUrl[], linkPreviewResponses: UrlPreviewResponse[]): void {
    document.body.style.cursor = 'progress';
    for (let url of urls) {
      if (!url.hasPreview) {
        this._httpService.get('https://api.linkpreview.net/?key=c5ba21883df06561e001eeada6f88a19&q=' + url.url).subscribe((data: UrlPreviewResponse) => {
          let previewResponse: UrlPreviewResponse = data;
          if (previewResponse && previewResponse.title && previewResponse.url) {
            url.hasPreview = true;
            if (!this._isUrlWithPreview(previewResponse.url, linkPreviewResponses)) {
              linkPreviewResponses.push(previewResponse);
            }
          }
        },
        error => {
          url.hasPreview = true;
          let errorResponse: UrlPreviewResponse = new UrlPreviewResponse();
          errorResponse.title = 'Произошла ошибка при получении данных от сервиса превью';
          errorResponse.image = './../../../assets/img/error.jpg';
          errorResponse.url = url.url;
          linkPreviewResponses.push(errorResponse);
        });
      }
    }
    document.body.style.cursor = 'default';
  }
}
