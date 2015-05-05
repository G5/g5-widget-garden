chooseRowCount = $(".select-row-count")
chooseWidget = $(".row-widgets select")
editNotice = $(".alert")

selectedRowCount = chooseRowCount.val()
editNotice.hide()

$('.row-widgets').hide()
$('.' + selectedRowCount).show()

chooseRowCount.on 'change', ->
  selectedRowCount = $(this).val()
  $('.row-widgets').hide()
  $('.' + selectedRowCount).show()

chooseWidget.on 'change', ->
  editNotice.show()
  $(this).parent().find("a").hide()

class EditWidgetModal
  constructor: (@widgetId, @widgetName, @columnWidgetId) ->
    $('#modal').data("component").set("selectedWidgetName", @widgetName)
    $('#myModalLabel').text("Edit #{@widgetName}")

  getEditForm: ->
    callback = (response) => @openModal response
    $.get @editURL(), {}, callback, "json"

  openModal: (response) ->
    $('#modal .modal-body').html(response["html"])
    if($('#ckeditor').length >= 1)
      CKEDITOR.replace('ckeditor')
    $('#modal').modal()
    $('.modal-body .edit_widget').submit =>
      if($('#ckeditor').length >= 1)
        $('#ckeditor').val(CKEDITOR.instances.ckeditor.getData())
      @saveEditForm()
      false
    false

  editURL: ->
    if @widgetId == null
      @widgetId = $(".column-edit").data("column-id")

    url = '/widgets/' + @widgetId + "/edit"
    @urlDomain(url) + url

  urlDomain: (data) ->
    a = document.createElement('a')
    a.href = data
    a.protocol + '//' + a.host

  #  Submits the widget configuration to the widget controller
  saveEditForm: ->
    $.ajax {
      url: $('.modal-body .edit_widget').prop('action'),
      type: 'PUT',
      dataType: 'json',
      data: $('.modal-body .edit_widget').serialize(),
      # Hide the configuration form if the request is successful
      success: =>
        if @widgetId == @columnWidgetId
          $('#modal').modal('hide')
          url = $('.preview iframe').prop('src')
          $('iframe').prop('src', url)
        else
          openColumnWidgetModal(@columnWidgetId)
      error: (xhr) =>
        # This is/was needed because of a bug in jQuery, it's actually successful
        if xhr.status == 204
          $('#modal').modal('hide')
        # Add validation errors
        else if xhr.responseText.length
          this.insertErrorMessages($.parseJSON(xhr.responseText))
        # Add server errors
        else
          this.insertErrorMessages({errors: {base: ["There was a problem saving the widget"]}})
    }

  insertErrorMessages: (errors) ->
    error = "<div class=\"alert alert-error\">" +
      errors["errors"]["base"][0] +
      "</div>"
    $('#modal .modal-body').prepend error

$(".edit-widget").on 'click', ->
  widgetId = $(this).data("widget-id")
  widgetName = $(this).data("widget-name")
  columnWidgetId = $(".column-edit").data("column-id")
  editWidgetModal = new EditWidgetModal(widgetId, widgetName, columnWidgetId)
  editWidgetModal.getEditForm()

$(".go-back").on 'click', ->
  rowWidgetId = $(".column-edit").data("row-id")

  if rowWidgetId
    editWidgetModal = new EditWidgetModal(rowWidgetId, rowWidgetId)
    editWidgetModal.getEditForm()
  else
    $('#modal').modal('hide')

openColumnWidgetModal = (columnWidgetId) ->
  editWidgetModal = new EditWidgetModal(columnWidgetId, null)
  editWidgetModal.getEditForm()
